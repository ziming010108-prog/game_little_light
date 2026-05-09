import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import ts from "typescript";

const root = new URL("..", import.meta.url);
const sourcePath = new URL("src/gameData.ts", root);
const source = await fs.readFile(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
  },
});
const tempPath = path.join(os.tmpdir(), `little-light-game-data-${Date.now()}.mjs`);
await fs.writeFile(tempPath, compiled.outputText, "utf8");

const {
  endings,
  initialRouteVariables,
  scriptNodes,
  scriptStartNodeId,
} = await import(`file://${tempPath}`);

const expectedNodes = [
  "P00",
  "P01",
  "P02",
  "P03",
  "P04_FRONT",
  "P04_PIPE",
  "P05",
  "P06A",
  "P06B",
  "P07A",
  "P07B",
  "P08",
  "P09_TAKE",
  "P09_LEAVE",
  "P10",
  "P13",
  "P14",
  "P14_1",
  "P14_2",
  "P14_3",
  "E01",
  "E02",
  "E03",
  "E04",
  "E05",
  "E06",
  "E07",
  "E08",
];

const missingNodes = expectedNodes.filter((id) => !scriptNodes[id]);
if (missingNodes.length > 0) {
  throw new Error(`Missing script nodes: ${missingNodes.join(", ")}`);
}

if (scriptNodes.P15) {
  throw new Error("Synthetic P15 still exists; script parity requires branch nodes instead.");
}

const isEnding = (nodeId) => Object.hasOwn(endings, nodeId);
const matches = (choice, variables) =>
  Object.entries(choice.requires ?? {}).every(([key, value]) => variables[key] === value);
const stateKey = (nodeId, variables) => `${nodeId}:${JSON.stringify(variables)}`;

const reachedEndings = new Map();
const terminalErrors = [];
const stack = [
  {
    nodeId: scriptStartNodeId,
    variables: initialRouteVariables,
    path: [scriptStartNodeId],
  },
];
const seen = new Set();

while (stack.length > 0) {
  const state = stack.pop();
  const key = stateKey(state.nodeId, state.variables);
  if (seen.has(key)) {
    continue;
  }
  seen.add(key);

  if (isEnding(state.nodeId)) {
    reachedEndings.set(state.nodeId, state.path);
    continue;
  }

  const node = scriptNodes[state.nodeId];
  if (!node) {
    terminalErrors.push(`Missing node ${state.nodeId} via ${state.path.join(" -> ")}`);
    continue;
  }

  const choices = node.choices.filter((choice) => matches(choice, state.variables));
  if (choices.length === 0) {
    terminalErrors.push(`No available choices at ${state.nodeId} via ${state.path.join(" -> ")}`);
    continue;
  }

  for (const choice of choices) {
    stack.push({
      nodeId: choice.next,
      variables: {
        ...state.variables,
        ...(choice.updates ?? {}),
      },
      path: [...state.path, `${choice.id}`, choice.next],
    });
  }
}

if (terminalErrors.length > 0) {
  throw new Error(terminalErrors.join("\n"));
}

const expectedEndings = Object.keys(endings).sort();
const missingEndings = expectedEndings.filter((ending) => !reachedEndings.has(ending));
if (missingEndings.length > 0) {
  throw new Error(`Unreachable endings: ${missingEndings.join(", ")}`);
}

console.log(`Validated ${Object.keys(scriptNodes).length} script nodes.`);
console.log(`Reachable endings: ${expectedEndings.join(", ")}`);
for (const ending of expectedEndings) {
  console.log(`${ending}: ${reachedEndings.get(ending).join(" -> ")}`);
}

