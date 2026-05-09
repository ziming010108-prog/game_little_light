import {
  Activity,
  Archive,
  ChevronRight,
  Crosshair,
  FlaskConical,
  Layers3,
  Radio,
  RotateCcw,
  ShieldAlert,
  Snowflake,
  Users,
} from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import {
  backgrounds,
  characters,
  clues,
  endings,
  initialRouteVariables,
  initialStats,
  scriptNodes,
  scriptStartNodeId,
  statLabels,
  type ClueCard,
  type RouteVariables,
  type ScriptChoice,
  type ScriptNode,
  type ScriptNodeId,
  type StatKey,
  type Stats,
} from "./gameData";

type Screen = "start" | "node" | "ending";
type EndingKey = keyof typeof endings;
type Panel = "clues" | "characters" | "log";

type GameState = {
  screen: Screen;
  nodeId: ScriptNodeId;
  stats: Stats;
  variables: RouteVariables;
  choiceIds: string[];
  clueIds: string[];
  characterIds: string[];
  log: string[];
  ending?: EndingKey;
};

const clamp = (value: number) => Math.max(0, Math.min(100, value));
const endingIds = new Set(Object.keys(endings));

const startState: GameState = {
  screen: "start",
  nodeId: scriptStartNodeId,
  stats: initialStats,
  variables: initialRouteVariables,
  choiceIds: [],
  clueIds: [],
  characterIds: ["shen-yan", "lin-he", "xu-ran"],
  log: [],
};

const statIcons: Record<StatKey, typeof Activity> = {
  truth: Radio,
  sample: FlaskConical,
  team: Users,
  exposure: Crosshair,
  coldChain: Snowflake,
  judgment: Archive,
  infection: ShieldAlert,
};

function uniquePush(list: string[], values: string[] = []) {
  return Array.from(new Set([...list, ...values]));
}

function applyEffects(stats: Stats, effects: ScriptChoice["effects"] = {}): Stats {
  return Object.fromEntries(
    Object.entries(stats).map(([key, value]) => [
      key,
      clamp(value + (effects[key as StatKey] ?? 0)),
    ]),
  ) as Stats;
}

function isEndingNode(nodeId: ScriptNodeId): nodeId is EndingKey {
  return endingIds.has(nodeId);
}

function isChoiceAvailable(choice: ScriptChoice, variables: RouteVariables) {
  return Object.entries(choice.requires ?? {}).every(
    ([key, expected]) => variables[key as keyof RouteVariables] === expected,
  );
}

function formatVariableValue(value: unknown) {
  if (typeof value === "boolean") {
    return value ? "是" : "否";
  }
  return String(value);
}

function formatRouteValue(key: keyof RouteVariables, value: RouteVariables[keyof RouteVariables]) {
  const vaccineHolderLabels: Record<string, string> = {
    none: "未交接",
    linhe: "林禾",
    atok: "阿拓",
    xuran: "许燃",
  };
  const shenyanStateLabels: Record<string, string> = {
    alive: "存活",
    infected: "感染",
    dead: "死亡",
    mutated: "异化",
    cryo_sleep: "冷舱休眠",
  };

  if (key === "vaccine_holder") {
    return vaccineHolderLabels[String(value)] ?? String(value);
  }
  if (key === "shenyan_state") {
    return shenyanStateLabels[String(value)] ?? String(value);
  }
  return formatVariableValue(value);
}

function formatChapterLabel(chapter: string) {
  return chapter.replace(/^分歧[\d.]+：/, "");
}

function formatKicker(kicker: string) {
  if (/[_=]|E0\d/.test(kicker)) {
    return "";
  }
  return kicker;
}

function formatChoiceLabel(label: string) {
  return label
    .replace(/^进入分歧[\d.]+：/, "")
    .replace(/^进入结局\s*E0\d：?/, "进入结局：");
}

function isAutomaticRouteTransition(choice: ScriptChoice) {
  return choice.id.startsWith("branch-") || choice.label.startsWith("进入分歧");
}

function cluePosition(slot: number) {
  const col = slot % 3;
  const row = Math.floor(slot / 3);
  return `${col * 50}% ${row * 100}%`;
}

function App() {
  const [game, setGame] = useState<GameState>(startState);
  const [panel, setPanel] = useState<Panel>("clues");
  const [sideOpen, setSideOpen] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [choicesOpen, setChoicesOpen] = useState(false);

  const currentNode = scriptNodes[game.nodeId];
  const currentEnding = game.ending ? endings[game.ending] : undefined;
  const isNarrationScreen = game.screen === "node" && currentNode?.kind === "narration";
  const background = currentEnding?.image || currentNode?.background || backgrounds.home;
  const sceneValue = background
    ? `url(${background})`
    : "linear-gradient(#050708, #050708)";

  const collectedClues = useMemo(
    () => clues.filter((clue) => game.clueIds.includes(clue.id)),
    [game.clueIds],
  );

  const visibleCharacters = useMemo(
    () => characters.filter((character) => game.characterIds.includes(character.id)),
    [game.characterIds],
  );

  const startGame = () => {
    setLineIndex(0);
    setChoicesOpen(false);
    setSideOpen(false);
    setGame({
      ...startState,
      screen: "node",
      log: ["沈砚线开始：疫苗坠落后的第一夜。"],
    });
  };

  const resetGame = () => {
    setGame(startState);
    setPanel("clues");
    setSideOpen(false);
    setLineIndex(0);
    setChoicesOpen(false);
  };

  const choose = (choice: ScriptChoice) => {
    const nextStats = applyEffects(game.stats, choice.effects);
    const nextVariables = {
      ...game.variables,
      ...(choice.updates ?? {}),
    };
    const nextChoiceIds = [...game.choiceIds, choice.id];
    const nextClues = uniquePush(
      game.clueIds,
      uniquePush(currentNode.defaultClues ?? [], choice.clueIds),
    );
    const nextCharacters = uniquePush(game.characterIds, choice.characterIds);
    const ending = isEndingNode(choice.next) ? choice.next : undefined;
    const resultLine = `${currentNode.title}：${formatChoiceLabel(choice.label)}`;

    setGame({
      ...game,
      screen: ending ? "ending" : "node",
      nodeId: choice.next,
      ending: ending ?? game.ending,
      stats: nextStats,
      variables: nextVariables,
      choiceIds: nextChoiceIds,
      clueIds: nextClues,
      characterIds: nextCharacters,
      log: ending
        ? [`结局：${endings[ending].title}`, resultLine, ...game.log].slice(0, 10)
        : [resultLine, ...game.log].slice(0, 10),
    });
    setLineIndex(0);
    setChoicesOpen(false);
    if (nextClues.length > game.clueIds.length) {
      setPanel("clues");
    }
  };

  return (
    <main
      className={`app ${isNarrationScreen ? "app--narration" : ""}`}
      style={{ "--scene": sceneValue } as CSSProperties}
    >
      {!isNarrationScreen && <div className="scene" />}
      {!isNarrationScreen && <div className="grain" />}
      <div className={`shell ${isNarrationScreen ? "narration-shell" : ""}`}>
        {!isNarrationScreen && (
          <header className="topbar">
            <div className="brand">
              <span className="brand-mark" />
              <div>
                <p>微孔过滤工厂 / 沈砚线</p>
                <h1>微孔：疫苗坠落</h1>
              </div>
            </div>
            <button className="icon-button" onClick={resetGame} aria-label="重新开始">
              <RotateCcw size={18} />
            </button>
          </header>
        )}

        {game.screen === "start" && <StartScreen onStart={startGame} />}
        {isNarrationScreen && currentNode && (
          <NarrationScreen
            node={currentNode}
            variables={game.variables}
            lineIndex={lineIndex}
            onAdvanceLine={() => setLineIndex((index) => index + 1)}
            onChoose={choose}
          />
        )}
        {game.screen === "node" && currentNode && !isNarrationScreen && (
          <GameScreen
            node={currentNode}
            stats={game.stats}
            variables={game.variables}
            clues={collectedClues}
            characters={visibleCharacters}
            panel={panel}
            setPanel={setPanel}
            sideOpen={sideOpen}
            setSideOpen={setSideOpen}
            lineIndex={lineIndex}
            choicesOpen={choicesOpen}
            log={game.log}
            onAdvanceLine={() => setLineIndex((index) => index + 1)}
            onChoose={choose}
            onCloseChoices={() => setChoicesOpen(false)}
            onOpenChoices={() => setChoicesOpen(true)}
          />
        )}
        {game.screen === "ending" && game.ending && (
          <EndingScreen
            ending={endings[game.ending]}
            stats={game.stats}
            variables={game.variables}
            clues={collectedClues}
            onRestart={resetGame}
          />
        )}
      </div>
    </main>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="start-layout">
      <div className="start-copy">
        <p className="eyebrow">视觉小说 / 互动叙事 / 生存悬疑</p>
        <h2>灰隼临死前说：疫苗无效。</h2>
        <p>
          现在的版本按新版沈砚线脚本逐幕推进。路线、分组、音爆弹、疫苗持有人与终局选择都会影响最终走向。
        </p>
        <button className="primary-button" onClick={onStart}>
          开始
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="mission-card">
        <div className="mission-card__seal">
          <FlaskConical size={34} />
        </div>
        <p>核心主题</p>
        <h3>护送不确定的希望</h3>
        <span>在不确定中护送希望，并承担判断错误的代价。</span>
      </div>
    </section>
  );
}

function NarrationScreen({
  node,
  variables,
  lineIndex,
  onAdvanceLine,
  onChoose,
}: {
  node: ScriptNode;
  variables: RouteVariables;
  lineIndex: number;
  onAdvanceLine: () => void;
  onChoose: (choice: ScriptChoice) => void;
}) {
  const currentIndex = Math.min(lineIndex, Math.max(node.lines.length - 1, 0));
  const currentLine = node.lines[currentIndex] ?? {
    speakerId: "narrator",
    speakerName: node.title,
    text: node.kicker,
  };
  const visibleChoices = node.choices.filter((choice) =>
    isChoiceAvailable(choice, variables),
  );
  const canContinueToNextNode = lineIndex >= node.lines.length - 1;

  return (
    <section className="narration-page">
      <div className="narration-copy">
        <p>{currentLine.text}</p>
        <div className="narration-actions">
          {canContinueToNextNode ? (
            visibleChoices.map((choice) => (
              <button
                className="narration-button"
                key={choice.id}
                onClick={() => onChoose(choice)}
              >
                {formatChoiceLabel(choice.label)}
                <ChevronRight size={20} />
              </button>
            ))
          ) : (
            <button className="narration-button" onClick={onAdvanceLine}>
              继续
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function GameScreen({
  node,
  stats,
  variables,
  clues,
  characters: visibleCharacters,
  panel,
  setPanel,
  sideOpen,
  setSideOpen,
  lineIndex,
  choicesOpen,
  log,
  onAdvanceLine,
  onChoose,
  onCloseChoices,
  onOpenChoices,
}: {
  node: ScriptNode;
  stats: Stats;
  variables: RouteVariables;
  clues: ClueCard[];
  characters: typeof characters;
  panel: Panel;
  setPanel: (panel: Panel) => void;
  sideOpen: boolean;
  setSideOpen: (open: boolean) => void;
  lineIndex: number;
  choicesOpen: boolean;
  log: string[];
  onAdvanceLine: () => void;
  onChoose: (choice: ScriptChoice) => void;
  onCloseChoices: () => void;
  onOpenChoices: () => void;
}) {
  const currentIndex = Math.min(lineIndex, Math.max(node.lines.length - 1, 0));
  const currentLine = node.lines[currentIndex] ?? {
    speakerId: "narrator",
    speakerName: node.title,
    text: node.kicker,
  };
  const canChoose = lineIndex >= node.lines.length - 1;
  const sceneCharacters = useMemo(
    () =>
      node.cast
        .map((id) => characters.find((character) => character.id === id))
        .filter(Boolean)
        .slice(0, 5) as typeof characters,
    [node.cast],
  );
  const visibleChoices = useMemo(
    () => node.choices.filter((choice) => isChoiceAvailable(choice, variables)),
    [node.choices, variables],
  );
  const automaticChoice =
    canChoose &&
    visibleChoices.length === 1 &&
    isAutomaticRouteTransition(visibleChoices[0])
      ? visibleChoices[0]
      : undefined;
  const modalKicker = formatKicker(node.kicker);

  return (
    <section
      className={`game-layout visual-novel phase-${node.phase} event-${node.id.toLowerCase()} scene-character-count-${sceneCharacters.length}`}
    >
      <StatusPanel stats={stats} variables={variables} />
      <div className="scene-stage" aria-hidden="true">
        {sceneCharacters.map((character, index) => (
          <img
            className={`scene-character scene-character--${index + 1} character-${character.id} ${
              currentLine.speakerId === character.id ? "is-speaking" : "is-idle"
            }`}
            src={character.image}
            alt=""
            key={character.id}
          />
        ))}
      </div>
      <article className="event-card dialogue-card">
        <p className="eyebrow">{formatChapterLabel(node.chapter)}</p>
        <h2 className="node-title">{node.title}</h2>
        <p className="event-body dialogue-text">
          <span className="speaker-inline">{currentLine.speakerName}</span>
          <span>{currentLine.text}</span>
        </p>
        <div className="dialogue-actions">
          <button
            className="continue-button"
            onClick={
              automaticChoice
                ? () => onChoose(automaticChoice)
                : canChoose
                  ? onOpenChoices
                  : onAdvanceLine
            }
          >
            {canChoose && !automaticChoice ? "继续判断" : "继续"}
            <ChevronRight size={18} />
          </button>
        </div>
      </article>
      {choicesOpen && (
        <div className="choice-overlay" role="dialog" aria-modal="true">
          <div className="choice-modal">
            <p className="eyebrow">剧情判断</p>
            <div className="judgment-lead">
              <span>{node.title}</span>
              {modalKicker && <strong>{modalKicker}</strong>}
            </div>
            <p className="judgment-prompt">选择会影响后续路线与最终结局。</p>
            <div className="modal-choices">
              {visibleChoices.map((choice) => (
                <button
                  className={`choice choice-option choice--${choice.tone}`}
                  key={choice.id}
                  onClick={() => onChoose(choice)}
                >
                  <span>{formatChoiceLabel(choice.label)}</span>
                  <ChevronRight size={18} />
                </button>
              ))}
              {visibleChoices.length === 0 && (
                <p className="empty">当前剧情条件下没有可用选择。</p>
              )}
            </div>
            <button
              className="modal-close"
              onClick={onCloseChoices}
              aria-label="关闭选择"
            >
              返回对白
            </button>
          </div>
        </div>
      )}
      <SidePanel
        panel={panel}
        setPanel={setPanel}
        isOpen={sideOpen}
        setIsOpen={setSideOpen}
        clues={clues}
        characters={visibleCharacters}
        log={log}
      />
    </section>
  );
}

function StatusPanel({
  stats,
  variables,
}: {
  stats: Stats;
  variables: RouteVariables;
}) {
  const routeChips = [
    `暴露值 ${variables.exposure_value}`,
    `救许燃 ${formatRouteValue("atok_saved_xuran", variables.atok_saved_xuran)}`,
    `音爆弹 ${formatRouteValue("has_sonic_bomb", variables.has_sonic_bomb)}`,
    `疫苗 ${formatRouteValue("vaccine_holder", variables.vaccine_holder)}`,
    `沈砚 ${formatRouteValue("shenyan_state", variables.shenyan_state)}`,
  ];

  return (
    <aside className="status-panel" aria-label="状态">
      {(Object.keys(statLabels) as StatKey[]).map((key) => {
        const Icon = statIcons[key];
        const value = stats[key];
        const isDanger =
          key === "exposure" || key === "infection" ? value >= 70 : value <= 30;
        const isWarning =
          key === "exposure" || key === "infection"
            ? value >= 50 && value < 70
            : value > 30 && value <= 50;
        return (
          <div
            className={`stat ${isDanger ? "is-danger" : ""} ${
              isWarning ? "is-warning" : ""
            }`}
            key={key}
          >
            <div className="stat__head">
              <span>
                <Icon size={15} />
                {statLabels[key]}
              </span>
              <strong>{Math.round(value)}</strong>
            </div>
            <div className="meter">
              <span
                className={`meter__fill meter__fill--${key}`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        );
      })}
      <div className="route-variable-list">
        {routeChips.map((chip) => (
          <span className="unlock-chip" key={chip}>
            {chip}
          </span>
        ))}
      </div>
    </aside>
  );
}

function SidePanel({
  panel,
  setPanel,
  isOpen,
  setIsOpen,
  clues,
  characters: visibleCharacters,
  log,
}: {
  panel: Panel;
  setPanel: (panel: Panel) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  clues: ClueCard[];
  characters: typeof characters;
  log: string[];
}) {
  const selectPanel = (nextPanel: Panel) => {
    if (isOpen && panel === nextPanel) {
      setIsOpen(false);
      return;
    }

    setPanel(nextPanel);
    setIsOpen(true);
  };

  return (
    <aside className={`side-panel ${isOpen ? "is-open" : "is-collapsed"}`}>
      <nav className="tabs" aria-label="资料切换">
        <button
          className={panel === "clues" ? "active" : ""}
          onClick={() => selectPanel("clues")}
        >
          <Layers3 size={16} />
          线索
        </button>
        <button
          className={panel === "characters" ? "active" : ""}
          onClick={() => selectPanel("characters")}
        >
          <Users size={16} />
          人物
        </button>
        <button
          className={panel === "log" ? "active" : ""}
          onClick={() => selectPanel("log")}
        >
          <Radio size={16} />
          记录
        </button>
      </nav>
      <div className="side-content" aria-hidden={!isOpen}>
        {panel === "clues" && <ClueGrid clues={clues} />}
        {panel === "characters" && <CharacterGrid characters={visibleCharacters} />}
        {panel === "log" && <LogPanel log={log} />}
      </div>
    </aside>
  );
}

function ClueGrid({ clues: collected }: { clues: ClueCard[] }) {
  if (!collected.length) {
    return <p className="empty">尚未确认任何有效线索。</p>;
  }

  return (
    <div className="clue-grid">
      {collected.map((clue) => (
        <article className="clue-card" key={clue.id}>
          <div
            className="clue-art"
            style={{
              backgroundImage: `url(${clue.sheet})`,
              backgroundPosition: cluePosition(clue.slot),
            }}
          />
          <div>
            <span>{clue.chapter}</span>
            <h3>{clue.name}</h3>
            <p>{clue.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function CharacterGrid({ characters: visible }: { characters: typeof characters }) {
  return (
    <div className="character-grid">
      {visible.map((character) => (
        <article className="character-card" key={character.id}>
          <img src={character.image} alt={character.name} />
          <div>
            <span>{character.role}</span>
            <h3>{character.name}</h3>
            <p>{character.quote}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function LogPanel({ log }: { log: string[] }) {
  if (!log.length) {
    return <p className="empty">通讯记录为空。</p>;
  }

  return (
    <ol className="log-list">
      {log.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ol>
  );
}

function EndingScreen({
  ending,
  stats,
  variables,
  clues,
  onRestart,
}: {
  ending: (typeof endings)[EndingKey];
  stats: Stats;
  variables: RouteVariables;
  clues: ClueCard[];
  onRestart: () => void;
}) {
  return (
    <section className="ending-layout">
      <div className="ending-copy">
        <p className="eyebrow">结局</p>
        <h2>{ending.title}</h2>
        {ending.text.split("\n").map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <blockquote>{ending.theme}</blockquote>
        <div className="ending-route">
          <p>
            <strong>触发条件</strong>
            {ending.trigger}
          </p>
          <p>
            <strong>最终路线</strong>
            疫苗持有人 {formatRouteValue("vaccine_holder", variables.vaccine_holder)} /
            音爆弹 {formatRouteValue("has_sonic_bomb", variables.has_sonic_bomb)} /
            阿拓救许燃{" "}
            {formatRouteValue("atok_saved_xuran", variables.atok_saved_xuran)} /
            沈砚 {formatRouteValue("shenyan_state", variables.shenyan_state)}
          </p>
        </div>
        <button className="primary-button" onClick={onRestart}>
          <RotateCcw size={18} />
          重新进入工厂
        </button>
      </div>
      <div className="summary-strip">
        <span>真相 {Math.round(stats.truth)}</span>
        <span>样本 {Math.round(stats.sample)}</span>
        <span>判断 {Math.round(stats.judgment)}</span>
        <span>线索 {clues.length}/15</span>
      </div>
    </section>
  );
}

export default App;
