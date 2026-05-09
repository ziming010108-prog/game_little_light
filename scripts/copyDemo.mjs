import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "game_intro_demo");
const destination = resolve(root, "dist", "game_intro_demo");

if (!existsSync(source)) {
  throw new Error(`Demo directory not found: ${source}`);
}

mkdirSync(resolve(root, "dist"), { recursive: true });
rmSync(destination, { recursive: true, force: true });
cpSync(source, destination, {
  recursive: true,
  filter: (path) => !path.includes(`${source}/.thumbnails`),
});

console.log(`Copied game intro demo to ${destination}`);
