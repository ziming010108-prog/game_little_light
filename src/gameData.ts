export type StatKey =
  | "truth"
  | "sample"
  | "team"
  | "exposure"
  | "coldChain"
  | "judgment"
  | "infection";

export type Stats = Record<StatKey, number>;

export type VaccineHolder = "none" | "linhe" | "atok" | "xuran";
export type ShenyanState = "alive" | "infected" | "dead" | "mutated" | "cryo_sleep";
export type SonicBombDirection =
  | "none"
  | "southwest"
  | "southeast_or_northwest"
  | "northeast";

export type RouteVariables = {
  exposure_value: number;
  atok_saved_xuran: boolean;
  has_sonic_bomb: boolean;
  vaccine_holder: VaccineHolder;
  xuran_exposed: boolean;
  shenyan_infected: boolean;
  vaccine_recovered_by_safezone: boolean;
  vaccine_taken_by_opposition: boolean;
  atok_alive: boolean;
  linhe_alive: boolean;
  shenyan_state: ShenyanState;
  sonic_bomb_direction: SonicBombDirection;
};

export type VariableConditions = Partial<RouteVariables>;

export type ChoiceTone = "careful" | "risky" | "technical" | "moral";

export type ScriptChoice = {
  id: string;
  label: string;
  tone: ChoiceTone;
  result: string;
  next: ScriptNodeId;
  effects?: Partial<Record<StatKey, number>>;
  clueIds?: string[];
  characterIds?: string[];
  requires?: VariableConditions;
  updates?: Partial<RouteVariables>;
};

export type ScriptLine = {
  speakerId: string;
  speakerName: string;
  text: string;
};

export type ScriptNodeKind = "narration" | "scene";
export type ScriptPhase = "探索" | "转折" | "追击" | "终局";
export type ScriptNodeId =
  | "P00"
  | "P01"
  | "P02"
  | "P03"
  | "P04_FRONT"
  | "P04_PIPE"
  | "P05"
  | "P06A"
  | "P06B"
  | "P07A"
  | "P07B"
  | "P08"
  | "P09_TAKE"
  | "P09_LEAVE"
  | "P10"
  | "P13"
  | "P14"
  | "P14_1"
  | "B1_1"
  | "B1_1_SONIC"
  | "B1_1_NO_SONIC"
  | "B1_2"
  | "B1_2_SONIC"
  | "B1_2_NO_SONIC"
  | "P14_2"
  | "B2_1"
  | "B2_1_SONIC"
  | "B2_1_NO_SONIC"
  | "B2_2"
  | "P14_3"
  | "B3_1"
  | "B3_2"
  | "E01"
  | "E02"
  | "E03"
  | "E04"
  | "E05"
  | "E06"
  | "E07"
  | "E08";

export type ScriptNode = {
  id: ScriptNodeId;
  kind: ScriptNodeKind;
  chapter: string;
  phase: ScriptPhase;
  title: string;
  kicker: string;
  background: string;
  cast: string[];
  lines: ScriptLine[];
  defaultClues?: string[];
  choices: ScriptChoice[];
};

export type CharacterCard = {
  id: string;
  name: string;
  role: string;
  image: string;
  quote: string;
};

export type ClueCard = {
  id: string;
  name: string;
  chapter: string;
  sheet: string;
  slot: number;
  description: string;
};

export type EndingCard = {
  title: string;
  image: string;
  trigger: string;
  theme: string;
  text: string;
};

export const initialStats: Stats = {
  truth: 18,
  sample: 70,
  team: 84,
  exposure: 12,
  coldChain: 100,
  judgment: 30,
  infection: 0,
};

export const initialRouteVariables: RouteVariables = {
  exposure_value: 0,
  atok_saved_xuran: false,
  has_sonic_bomb: false,
  vaccine_holder: "none",
  xuran_exposed: false,
  shenyan_infected: false,
  vaccine_recovered_by_safezone: false,
  vaccine_taken_by_opposition: false,
  atok_alive: true,
  linhe_alive: true,
  shenyan_state: "alive",
  sonic_bomb_direction: "none",
};

export const backgrounds = {
  home: "/backgrounds/BG_00_home_key_visual.png",
  black: "",
};

export const endings: Record<Extract<ScriptNodeId, `E0${number}`>, EndingCard> = {
  E01: {
    title: "异化的希望",
    image: "/endings/END_01_mutated_hope.png",
    trigger:
      "疫苗给林禾；选择继续与对抗局缠斗；已拿音爆弹；沈砚感染后选择给自己使用疫苗。",
    text:
      "疫苗无效。\n沈砚异化。\n阿拓开枪打死沈砚。\n林禾和阿拓等到了安全区救援小队，但没有疫苗。",
    theme: "希望被错误使用时，会变成第二次伤害。",
  },
  E02: {
    title: "最后一枪",
    image: "/endings/END_02_last_shot.png",
    trigger:
      "路径一：疫苗给林禾；选择继续与对抗局缠斗；已拿音爆弹；沈砚感染后选择自戕。路径二：疫苗给林禾；选择带着疫苗组织撤离；未拿音爆弹；沈砚感染后选择自戕。",
    text: "沈砚自杀。\n林禾和阿拓等到了安全区救援小队，但没有疫苗。",
    theme: "沈砚没有赌疫苗，也没有让自己变成感染源。",
  },
  E03: {
    title: "黑潮之后",
    image: "/endings/END_03_after_black_tide.png",
    trigger: "疫苗给林禾；选择继续与对抗局缠斗；未拿音爆弹。",
    text: "三人均死在感染者攻击下。\n对抗局等感染者退去后取走疫苗。",
    theme: "在错误时间争夺希望，会让真正靠近希望的人先死。",
  },
  E04: {
    title: "冷舱里的队长",
    image: "/endings/END_04_captain_in_cryo.png",
    trigger:
      "路径一：疫苗给林禾；选择带着疫苗组织撤离；已拿音爆弹；音爆弹扔向西南方。路径二：疫苗给林禾；选择带着疫苗组织撤离；未拿音爆弹；选择让阿拓修好冷舱，自我冬眠。",
    text: "林禾和阿拓等到了安全区救援小队。\n安全区拿回疫苗。\n沈砚被冷舱休眠带回。",
    theme: "希望没有兑现，但死亡被暂时推迟。",
  },
  E05: {
    title: "带回问题的人",
    image: "/endings/END_05_bring_back_the_question.png",
    trigger:
      "疫苗给林禾；选择带着疫苗组织撤离；已拿音爆弹；音爆弹扔向东南方或西北方。",
    text: "三人逃出厂区，遇到安全区救援小队。\n安全区拿回疫苗。\n沈砚、林禾、阿拓三人存活。",
    theme: "他们带回的不是答案，而是必须被验证的问题。",
  },
  E06: {
    title: "两枚铭牌",
    image: "/endings/END_06_two_tags.png",
    trigger:
      "疫苗给阿拓；前面没有触发“阿拓与许燃同行”；许燃杀死阿拓；沈砚撤离途中感染；沈砚选择自我终结或让林禾击毙自己。",
    text:
      "许燃杀死阿拓，带走疫苗。\n沈砚为保护林禾感染，最终死亡。\n林禾等到安全区救援小队，独自返回安全区。\n她带回沈砚和阿拓的铭牌。",
    theme: "有些没有发生的善意，会在更晚的时候变成无法阻止的枪声。",
  },
  E07: {
    title: "失去疫苗，留下沈砚",
    image: "/endings/END_07_lost_vaccine_saved_shenyan.png",
    trigger:
      "疫苗给阿拓且阿拓救过许燃后失去疫苗，或疫苗给许燃；突围失败导致沈砚感染并进入冷舱。",
    text:
      "对抗局带走疫苗。\n沈砚在突围中感染。\n阿拓修好冷舱。\n林禾和阿拓等到安全区救援小队。\n他们没有拿回疫苗，但带回了被冷舱休眠的沈砚。",
    theme: "任务失败了，但死亡被暂时推迟。",
  },
  E08: {
    title: "活着的失败者",
    image: "/endings/END_08_living_failures.png",
    trigger:
      "疫苗给阿拓且阿拓救过许燃，或疫苗给许燃；已拿音爆弹；音爆弹扔向东北方向。",
    text:
      "对抗局带走疫苗。\n沈砚、林禾、阿拓三人逃出厂区，遇到安全区救援小队。\n他们活了下来，但没有拿回疫苗。",
    theme: "活着回来，不等于完成任务。只是下一次失败还有人能讲述。",
  },
};

export const characters: CharacterCard[] = [
  {
    id: "shen-yan",
    name: "沈砚",
    role: "安全区行动队长",
    image: "/characters/CH_01_shen_yan.png",
    quote: "玩家扮演角色，负责路线、分组、疫苗交接和撤离选择。",
  },
  {
    id: "lin-he",
    name: "林禾",
    role: "安全区疫苗研究员",
    image: "/characters/CH_02_lin_he.png",
    quote: "判断疫苗状态，发现许燃异常，关键结局中决定是否面对疫苗无效。",
  },
  {
    id: "a-tuo",
    name: "阿拓",
    role: "安全区机械师",
    image: "/characters/CH_03_a_tuo.png",
    quote: "开维修闸、救许燃、修音爆弹、修冷舱，是多条分支的关键人物。",
  },
  {
    id: "xu-ran",
    name: "许燃",
    role: "安全区通讯员",
    image: "/characters/CH_04_xu_ran.png",
    quote: "实际为对抗局卧底，暗中传递坐标，后期暴露并回归邵戟。",
  },
  {
    id: "white-owl",
    name: "白鸮",
    role: "对抗局卧底",
    image: "/characters/CH_05_white_owl_exposed.png",
    quote: "许燃归队后的真实身份。是否直接杀阿拓，取决于前面的关系链。",
  },
  {
    id: "gray-falcon",
    name: "灰隼",
    role: "对抗局特工",
    image: "/characters/CH_06_gray_falcon.png",
    quote: "留下“疫苗无效”信号，是序章任务起点。",
  },
  {
    id: "shao-ji",
    name: "邵戟",
    role: "对抗局突击队长",
    image: "/characters/CH_07_shao_ji.png",
    quote: "率队抢夺疫苗，引爆第五章阵营冲突。",
  },
  {
    id: "nest-listener",
    name: "感染者群",
    role: "工厂内部威胁",
    image: "/characters/CH_08_nest_listener.png",
    quote: "驱动战斗、追击、感染、冷舱分支。",
  },
];

export const clues: ClueCard[] = [
  {
    id: "signal",
    name: "灰隼信号",
    chapter: "序章",
    sheet: "/clues/CLUE_SET_A_01_to_06.png",
    slot: 0,
    description: "灰隼临终广播只剩四个字：疫苗无效。",
  },
  {
    id: "tail-number",
    name: "运输机尾号 791",
    chapter: "第一章",
    sheet: "/clues/CLUE_SET_A_01_to_06.png",
    slot: 1,
    description: "尾号 791 与失联运输机吻合，坠机点确认在微孔过滤工厂。",
  },
  {
    id: "access",
    name: "维修闸锁芯",
    chapter: "第一章",
    sheet: "/clues/CLUE_SET_A_01_to_06.png",
    slot: 2,
    description: "废弃维护管道内的维修闸被菌丝挤满，仍能被阿拓打开。",
  },
  {
    id: "broken-vial",
    name: "破碎第一支疫苗",
    chapter: "第一章",
    sheet: "/clues/CLUE_SET_A_01_to_06.png",
    slot: 3,
    description: "一支疫苗已破碎，主冷链箱被拖离机腹残骸。",
  },
  {
    id: "falcon-recorder",
    name: "灰隼记录仪",
    chapter: "第三章",
    sheet: "/clues/CLUE_SET_A_01_to_06.png",
    slot: 4,
    description: "记录仪显示感染者拖走研究员和疫苗箱。",
  },
  {
    id: "infected-guard",
    name: "感染警卫",
    chapter: "第二章",
    sheet: "/clues/CLUE_SET_A_01_to_06.png",
    slot: 5,
    description: "机尾出现的感染警卫，差点在许燃发信后袭击他。",
  },
  {
    id: "atuo-saved-xu",
    name: "阿拓救下许燃",
    chapter: "第二章",
    sheet: "/clues/CLUE_SET_B_07_to_12.png",
    slot: 0,
    description: "阿拓投出匕首救下许燃，白鸮后续因此产生迟疑。",
  },
  {
    id: "missed-pair",
    name: "未建立的信任链",
    chapter: "第二章",
    sheet: "/clues/CLUE_SET_B_07_to_12.png",
    slot: 1,
    description: "阿拓和许燃没有共同搜查机尾，也没有发生救命债。",
  },
  {
    id: "drag",
    name: "冷链拖拽痕迹",
    chapter: "第三章",
    sheet: "/clues/CLUE_SET_B_07_to_12.png",
    slot: 2,
    description: "冷链箱外壳刮出的痕迹一路延伸到巢穴深处。",
  },
  {
    id: "sonic-bomb",
    name: "小型音爆弹",
    chapter: "第三章",
    sheet: "/clues/CLUE_SET_C_13_to_18.png",
    slot: 3,
    description: "驾驶舱警卫尸体旁的小型音爆弹，后续可由阿拓修好。",
  },
  {
    id: "vaccine",
    name: "主冷链箱",
    chapter: "第四章",
    sheet: "/clues/CLUE_SET_B_07_to_12.png",
    slot: 4,
    description: "主疫苗箱低温仍在，但被菌丝缠在巢穴中央。",
  },
  {
    id: "white-owl",
    name: "白鸮归队",
    chapter: "第五章",
    sheet: "/clues/CLUE_SET_C_13_to_18.png",
    slot: 0,
    description: "邵戟叫出代号后，许燃放下安全区耳麦，回到对抗局。",
  },
  {
    id: "backstab-window",
    name: "背后枪线",
    chapter: "第五章",
    sheet: "/clues/CLUE_SET_C_13_to_18.png",
    slot: 1,
    description: "许燃退到阿拓身后时，拥有邵戟远距离不具备的夺箱机会。",
  },
  {
    id: "cryo-chamber",
    name: "废弃冷舱",
    chapter: "终局",
    sheet: "/clues/CLUE_SET_C_13_to_18.png",
    slot: 2,
    description: "阿拓能修好冷舱，把沈砚的死亡暂时推迟。",
  },
  {
    id: "rescue-team",
    name: "救援小队灯束",
    chapter: "终局",
    sheet: "/clues/CLUE_SET_C_13_to_18.png",
    slot: 5,
    description: "安全区救援小队接入撤离线，决定谁能把问题带回去。",
  },
];

const c = (
  id: string,
  label: string,
  tone: ChoiceTone,
  next: ScriptNodeId,
  result = "",
  extra: Omit<ScriptChoice, "id" | "label" | "tone" | "next" | "result"> = {},
): ScriptChoice => ({ id, label, tone, next, result, ...extra });

const line = (speakerName: string, text: string, speakerId = "narrator"): ScriptLine => ({
  speakerId,
  speakerName,
  text,
});

export const scriptNodes: Record<ScriptNodeId, ScriptNode> = {
  P00: {
    id: "P00",
    kind: "narration",
    chapter: "序章",
    phase: "探索",
    title: "最后一段信号",
    kicker: "黑底旁白",
    background: backgrounds.black,
    cast: [],
    defaultClues: ["signal"],
    lines: [
      line("旁白", "凌晨三点十七分，安全区监控室收到一段断续信号。"),
      line("旁白", "信号源来自西北工业遗址。"),
      line("旁白", "那里也是疫苗运输机最后消失的位置。"),
    ],
    choices: [c("continue-p00", "继续", "careful", "P01")],
  },
  P01: {
    id: "P01",
    kind: "scene",
    chapter: "序章",
    phase: "探索",
    title: "安全区监控室",
    kicker: "收到灰隼“疫苗无效”信号",
    background: "/backgrounds/BG_07_safezone_monitoring_room.png",
    cast: ["shen-yan", "lin-he", "a-tuo", "xu-ran", "gray-falcon"],
    defaultClues: ["signal"],
    lines: [
      line("监控室人员", "信号源确认，微孔过滤工厂一带。和运输机失联坐标重合。"),
      line("安全区指挥官", "把原始频段放大。不要只听自动解码。"),
      line("监控室人员", "噪声太重，只能还原一小段。"),
      line("灰隼广播", "疫苗……无效。", "gray-falcon"),
      line("监控室人员", "灰隼？"),
      line("安全区指挥官", "现已查明灰隼是潜伏在运输机上的对抗局特工。叛徒留下的信号，不能信。"),
      line("安全区指挥官", "通知沈砚，立刻组建搜救小队，取回疫苗。"),
      line("画面", "沈砚、林禾、阿拓、许燃四人集结。"),
    ],
    choices: [
      c("accept-mission", "立刻组建搜救小队", "moral", "P02", "沈砚小队离开安全区。", {
        characterIds: ["shen-yan", "lin-he", "a-tuo", "xu-ran", "gray-falcon"],
        effects: { truth: 4, judgment: 4 },
      }),
    ],
  },
  P02: {
    id: "P02",
    kind: "narration",
    chapter: "序章",
    phase: "探索",
    title: "出发",
    kicker: "黑底旁白",
    background: backgrounds.black,
    cast: [],
    lines: [
      line("旁白", "一小时后，回收小队离开安全区。"),
      line("旁白", "任务是回收疫苗。"),
      line("旁白", "沈砚不确定灰隼是否说了真话。"),
      line("旁白", "但只要疫苗还有一丝可能，就必须有人把它带回来。"),
    ],
    choices: [c("continue-p02", "抵达工厂外墙", "careful", "P03")],
  },
  P03: {
    id: "P03",
    kind: "scene",
    chapter: "第一章：坠机残骸",
    phase: "探索",
    title: "工厂外墙",
    kicker: "选择进入路线",
    background: "/backgrounds/BG_01_crash_coordinates.png",
    cast: ["shen-yan", "a-tuo", "xu-ran"],
    defaultClues: ["tail-number"],
    lines: [
      line("场景说明", "运输机尾翼斜插在工厂顶部，残破编号“791”仍能辨认。"),
      line("场景说明", "工厂外墙早已破损，正门附近有少量感染者游荡。"),
      line("场景说明", "另一侧有一条废弃维护管道，疑似通向厂房内部的过滤区。"),
      line("许燃", "尾号确认，791。是那架运输机。", "xu-ran"),
      line("阿拓", "不是迫降，是砸进去的。你看屋顶断面，机身应该卡在过滤大厅上方。", "a-tuo"),
      line("沈砚", "正门情况。", "shen-yan"),
      line("阿拓", "门不用破，早烂了。问题是门口有东西。", "a-tuo"),
      line("许燃", "三只，可能四只。活动慢，没发现我们。", "xu-ran"),
      line("阿拓", "还有一条废弃维护管道，应该能绕进厂房侧面。", "a-tuo"),
      line("沈砚", "能通到残骸？", "shen-yan"),
      line("阿拓", "理论上能。坏消息是，管道出口有一道维修闸，八成锁死。", "a-tuo"),
      line("许燃", "正面通过更快。只要不交火，就不会惊动它们。", "xu-ran"),
      line("阿拓", "也更容易被看见。这里太空，连个能躲的铁皮都没有。", "a-tuo"),
      line("沈砚", "我们不是来清场的。目标是残骸和疫苗箱。", "shen-yan"),
    ],
    choices: [
      c("route-front", "从正门外侧低姿态穿过，直接接近机腹残骸", "risky", "P04_FRONT", "沈砚：直接穿过去，低姿态通过。", {
        updates: { exposure_value: 1 },
        effects: { exposure: 12, team: 2 },
      }),
      c("route-pipe", "绕进废弃管道，从过滤区侧面进入", "technical", "P04_PIPE", "沈砚：走管道。许燃：管道里信号会弱。", {
        clueIds: ["access"],
        effects: { exposure: -2, judgment: 5 },
      }),
    ],
  },
  P04_FRONT: {
    id: "P04_FRONT",
    kind: "narration",
    chapter: "第一章：坠机残骸",
    phase: "探索",
    title: "进入残骸区",
    kicker: "选择正面穿过后",
    background: backgrounds.black,
    cast: [],
    lines: [
      line("旁白", "空旷厂区里，任何移动都很难真正隐藏。"),
      line("旁白", "他们更快接近了残骸，也更早暴露在工厂的视线里。"),
    ],
    choices: [c("continue-p04-front", "进入机腹残骸", "careful", "P05")],
  },
  P04_PIPE: {
    id: "P04_PIPE",
    kind: "narration",
    chapter: "第一章：坠机残骸",
    phase: "探索",
    title: "进入残骸区",
    kicker: "选择废弃管道后",
    background: backgrounds.black,
    cast: [],
    lines: [
      line("旁白", "阿拓打开维修闸时，锁芯里挤出一截灰白色菌丝。"),
      line("旁白", "它像某种已经死去的神经，仍然记得如何收缩。"),
    ],
    choices: [c("continue-p04-pipe", "进入机腹残骸", "careful", "P05")],
  },
  P05: {
    id: "P05",
    kind: "scene",
    chapter: "第一章：坠机残骸",
    phase: "探索",
    title: "机腹残骸",
    kicker: "是否让阿拓和许燃一组搜查机身尾部",
    background: "/backgrounds/BG_14_belly_wreckage_broken_vaccine.png",
    cast: ["shen-yan", "lin-he", "a-tuo", "xu-ran"],
    defaultClues: ["broken-vial", "drag"],
    lines: [
      line("林禾", "这里有一支破碎的疫苗。运输机一共有两支疫苗，还有一支在哪？", "lin-he"),
      line("沈砚", "机身断成了两截，我们分头找。", "shen-yan"),
      line("阿拓", "一支破了。主箱被拖走了。", "a-tuo"),
      line("许燃", "我去机尾找找。", "xu-ran"),
      line("沈砚", "别单独行动，两两一组。", "shen-yan"),
    ],
    choices: [
      c("pair-atuo-xu", "让阿拓和许燃同行", "careful", "P06A", "进入 P06A：阿拓与许燃同行。", {
        updates: { atok_saved_xuran: true },
        clueIds: ["atuo-saved-xu", "infected-guard"],
        effects: { judgment: 6, exposure: 4 },
      }),
      c("split-atuo-xu", "不让阿拓和许燃同行", "technical", "P06B", "进入 P06B：没有阿拓救许燃。", {
        updates: { atok_saved_xuran: false },
        clueIds: ["missed-pair"],
        effects: { team: 3, truth: -2 },
      }),
    ],
  },
  P06A: {
    id: "P06A",
    kind: "scene",
    chapter: "第二章：机身尾部",
    phase: "探索",
    title: "机身尾部：阿拓与许燃同行",
    kicker: "阿拓救下许燃",
    background: "/backgrounds/BG_08_aircraft_tail_search.png",
    cast: ["a-tuo", "xu-ran"],
    lines: [
      line("许燃", "你先走，我检查设备，通讯频道中断了。", "xu-ran"),
      line("旁白", "许燃在阿拓背后蹲下调试通讯设备，暗中给对抗局发送消息。"),
      line("阿拓", "不急，我先去看看。", "a-tuo"),
      line("旁白", "过了一会儿，许燃发完消息，准备起身。"),
      line("旁白", "感染警卫出现在许燃身后，正准备袭击。"),
      line("旁白", "阿拓转身看向许燃，发现感染警卫。"),
      line("阿拓", "许燃，低头。", "a-tuo"),
      line("旁白", "许燃立马蹲下，匕首刺中感染警卫头部，感染警卫倒地。"),
      line("阿拓", "怎么样，准吧。", "a-tuo"),
      line("许燃", "谢了，继续找疫苗吧。", "xu-ran"),
      line("沈砚（无线电）", "阿拓，汇报！", "shen-yan"),
      line("阿拓", "我们遭遇了感染者，但已经被我解决了。", "a-tuo"),
    ],
    choices: [c("continue-p06a", "进入错过的瞬间", "careful", "P07A")],
  },
  P06B: {
    id: "P06B",
    kind: "scene",
    chapter: "第二章：机身尾部",
    phase: "探索",
    title: "机身尾部：分开搜查",
    kicker: "没有救命债",
    background: "/backgrounds/BG_08_aircraft_tail_search.png",
    cast: ["shen-yan", "lin-he", "a-tuo", "xu-ran"],
    lines: [
      line("许燃", "尾部无生命特征反应，我一个人就行。", "xu-ran"),
      line("阿拓", "我在附近找找有没有什么好玩意。", "a-tuo"),
      line("沈砚", "所有人保持频道，有情况及时反应。", "shen-yan"),
      line("旁白", "沈砚和林禾一组探索驾驶舱，阿拓在附近警戒，许燃独自探索尾部。"),
    ],
    choices: [c("continue-p06b", "进入错过的瞬间", "careful", "P07B")],
  },
  P07A: {
    id: "P07A",
    kind: "narration",
    chapter: "第二章：机身尾部",
    phase: "探索",
    title: "错过的瞬间",
    kicker: "同行后",
    background: backgrounds.black,
    cast: [],
    lines: [
      line("旁白", "有些债不是立刻偿还的。"),
      line("旁白", "它会留在沉默里，直到枪口抬起的那一刻。"),
    ],
    choices: [c("continue-p07a", "进入驾驶舱记录仪", "careful", "P08")],
  },
  P07B: {
    id: "P07B",
    kind: "narration",
    chapter: "第二章：机身尾部",
    phase: "探索",
    title: "错过的瞬间",
    kicker: "分开后",
    background: backgrounds.black,
    cast: [],
    lines: [
      line("旁白", "他们避开了一次危险。"),
      line("旁白", "也错过了一次看清彼此的机会。"),
    ],
    choices: [c("continue-p07b", "进入驾驶舱记录仪", "careful", "P08")],
  },
  P08: {
    id: "P08",
    kind: "scene",
    chapter: "第三章：灰隼记录仪",
    phase: "探索",
    title: "驾驶舱记录仪",
    kicker: "是否拿走音爆弹",
    background: "/backgrounds/BG_09_cockpit_recorder.png",
    cast: ["shen-yan", "lin-he"],
    defaultClues: ["falcon-recorder", "drag"],
    lines: [
      line("林禾", "记录仪还亮着，但没有看到疫苗。", "lin-he"),
      line("沈砚", "附近倒是有孢子痕迹，可能有感染者。", "shen-yan"),
      line("旁白", "林禾在操作台调取日志。"),
      line("旁白", "沈砚在一旁警卫尸体上发现了一个打开保险但没有爆炸的小型音爆弹。"),
      line("林禾", "这有飞机失事前的监控视频。", "lin-he"),
      line("沈砚", "打开看看，说不定有什么线索。", "shen-yan"),
      line("旁白", "画面断断续续。"),
      line("旁白", "画面中，一个研究人员重伤躺地，死死抱住疫苗箱子。"),
      line("旁白", "不久后，一个感染者出现，将研究人员拖走。"),
      line("林禾", "为什么感染者要带走他，不应当场进食吗。", "lin-he"),
      line("沈砚", "重点是感染者把疫苗也带走了。我们去和他们汇合吧。", "shen-yan"),
    ],
    choices: [
      c("take-sonic-bomb", "拿走音爆弹", "technical", "P09_TAKE", "has_sonic_bomb = true。", {
        updates: { has_sonic_bomb: true },
        clueIds: ["sonic-bomb"],
        effects: { judgment: 7 },
      }),
      c("leave-sonic-bomb", "不拿音爆弹", "risky", "P09_LEAVE", "has_sonic_bomb = false。", {
        updates: { has_sonic_bomb: false },
        effects: { judgment: -5, team: 2 },
      }),
    ],
  },
  P09_TAKE: {
    id: "P09_TAKE",
    kind: "narration",
    chapter: "第三章：灰隼记录仪",
    phase: "探索",
    title: "深入巢穴",
    kicker: "拿走音爆弹",
    background: backgrounds.black,
    cast: [],
    lines: [
      line("旁白", "四人汇合。"),
      line("旁白", "沈砚决定沿着孢子痕迹寻找疫苗。"),
      line("旁白", "他将音爆弹交给了阿拓。"),
    ],
    choices: [c("continue-p09-take", "进入巢穴冷箱", "careful", "P10")],
  },
  P09_LEAVE: {
    id: "P09_LEAVE",
    kind: "narration",
    chapter: "第三章：灰隼记录仪",
    phase: "探索",
    title: "深入巢穴",
    kicker: "没拿音爆弹",
    background: backgrounds.black,
    cast: [],
    lines: [
      line("旁白", "四人汇合。"),
      line("旁白", "沈砚决定沿着孢子痕迹寻找疫苗。"),
    ],
    choices: [c("continue-p09-leave", "进入巢穴冷箱", "careful", "P10")],
  },
  P10: {
    id: "P10",
    kind: "scene",
    chapter: "第四章：巢穴冷箱",
    phase: "转折",
    title: "巢穴冷箱",
    kicker: "疫苗交给谁",
    background: "/backgrounds/BG_10_nest_cold_box.png",
    cast: ["shen-yan", "lin-he", "a-tuo", "xu-ran"],
    defaultClues: ["vaccine"],
    lines: [
      line("场景说明", "四人进入过滤大厅。大厅正中有一个巨大肉球。"),
      line("场景说明", "研究员被菌丝包裹腐蚀，好像正被一点点吃掉。"),
      line("场景说明", "一旁的疫苗箱被包裹在菌丝中。"),
      line("林禾", "箱体低温还在，疫苗没被破坏。", "lin-he"),
      line("阿拓", "但被菌丝缠住了。电动工具一响，里面那群东西都得醒。", "a-tuo"),
      line("许燃", "大批感染者正朝这边聚集。", "xu-ran"),
      line("沈砚", "阿拓和我一起去取疫苗，速度要快。林禾、许燃，你们找撤离路线。", "shen-yan"),
      line("阿拓 / 许燃 / 林禾", "好。"),
      line("旁白", "林禾和许燃寻找撤离路线。"),
      line("旁白", "林禾发现许燃通讯器信号灯正常，陷入思索。"),
      line("旁白", "沈砚和阿拓取出疫苗返回，但感染者群已经近在咫尺。"),
      line("沈砚", "疫苗到手。许燃，怎么撤离？", "shen-yan"),
      line("许燃", "走运输车间，路线短，沿途风险低，从工厂次入口出去。队长，我装备少，我拿疫苗吧。", "xu-ran"),
      line("林禾", "我拿着吧，许燃还要恢复和总部通讯呢。", "lin-he"),
      line("旁白", "沈砚察觉二人反常，决定疫苗交给谁。"),
    ],
    choices: [
      c("holder-linhe", "疫苗给林禾", "careful", "P13", "vaccine_holder = linhe。", {
        updates: { vaccine_holder: "linhe" },
        effects: { truth: 4, sample: 4 },
      }),
      c("holder-atok", "疫苗给阿拓", "technical", "P13", "vaccine_holder = atok。", {
        updates: { vaccine_holder: "atok" },
        effects: { coldChain: 8, sample: 4 },
      }),
      c("holder-xuran", "疫苗给许燃", "risky", "P13", "vaccine_holder = xuran。", {
        updates: { vaccine_holder: "xuran" },
        effects: { exposure: 8, judgment: -8 },
      }),
    ],
  },
  P13: {
    id: "P13",
    kind: "narration",
    chapter: "第五章：白鸮归队",
    phase: "追击",
    title: "第二批来客",
    kicker: "黑底旁白",
    background: backgrounds.black,
    cast: [],
    lines: [
      line("旁白", "安全区在沈砚小队进入工厂后联络断开，尝试重新连接，但一直连接不上。"),
      line("旁白", "指挥官收到一条侦察处的消息后，立即派出救援小队前去支援。"),
      line("旁白", "沈砚一心往车间逃亡，甩掉感染者。"),
      line("旁白", "但他不知道，车间还有人在等着疫苗。"),
    ],
    choices: [c("continue-p13", "进入运输车间", "careful", "P14")],
  },
  P14: {
    id: "P14",
    kind: "scene",
    chapter: "第五章：白鸮归队",
    phase: "追击",
    title: "对抗局突入",
    kicker: "邵戟带队，枪指四人",
    background: "/backgrounds/BG_04_aircraft_wreckage.png",
    cast: ["shen-yan", "lin-he", "a-tuo", "xu-ran", "shao-ji"],
    defaultClues: ["white-owl"],
    lines: [
      line("邵戟", "把疫苗留下，还可以活着离开。", "shao-ji"),
      line("沈砚", "对抗局？", "shen-yan"),
      line("邵戟", "沈砚，好久不见，谢谢你帮我拿到疫苗。", "shao-ji"),
      line("林禾", "沈队，疫苗不能给他们，对抗局都是疯子。", "lin-he"),
      line("阿拓", "跟他们拼了，不能让这帮崽子得逞。", "a-tuo"),
    ],
    choices: [
      c("branch-linhe", "进入分歧1：疫苗给林禾", "careful", "P14_1", "vaccine_holder = linhe。", {
        requires: { vaccine_holder: "linhe" },
      }),
      c("branch-atok", "进入分歧2：疫苗给阿拓", "technical", "P14_2", "vaccine_holder = atok。", {
        requires: { vaccine_holder: "atok" },
      }),
      c("branch-xuran", "进入分歧3：疫苗给许燃", "risky", "P14_3", "vaccine_holder = xuran。", {
        requires: { vaccine_holder: "xuran" },
      }),
    ],
  },
  P14_1: {
    id: "P14_1",
    kind: "scene",
    chapter: "分歧1：疫苗给林禾",
    phase: "追击",
    title: "白鸮暴露：林禾防备成功",
    kicker: "vaccine_holder = linhe",
    background: "/backgrounds/BG_15_transport_workshop_standoff.png",
    cast: ["shen-yan", "lin-he", "a-tuo", "white-owl", "shao-ji"],
    lines: [
      line("旁白", "许燃靠近林禾准备拔枪。"),
      line("旁白", "林禾发现异常，也拔枪。"),
      line("旁白", "二者枪指对方。"),
      line("旁白", "许燃没拿到疫苗，退到邵戟身边。"),
      line("沈砚", "许燃？", "shen-yan"),
      line("林禾", "许燃，你果然有问题。", "lin-he"),
      line("邵戟", "白鸮，归队。", "shao-ji"),
      line("旁白", "双方短暂交锋，引来感染者群。"),
      line("阿拓", "许燃你这个忘恩负义的家伙，沈队我们现在该怎么办？", "a-tuo"),
    ],
    choices: [
      c("linhe-fight", "继续与对抗局缠斗", "risky", "B1_1", "沈砚：先击退他们，再对付感染者。", {
        updates: { xuran_exposed: true },
        characterIds: ["white-owl", "shao-ji"],
        effects: { exposure: 14, team: -8 },
      }),
      c("linhe-evacuate", "带着疫苗组织撤离", "careful", "B1_2", "沈砚：疫苗已经拿到手了，不要与他们缠斗。", {
        updates: { xuran_exposed: true },
        characterIds: ["white-owl", "shao-ji"],
        effects: { judgment: 8, exposure: 4 },
      }),
    ],
  },
  B1_1: {
    id: "B1_1",
    kind: "scene",
    chapter: "分歧1.1：继续与对抗局缠斗",
    phase: "追击",
    title: "感染者包围",
    kicker: "根据 has_sonic_bomb 分流",
    background: "/backgrounds/BG_11_manual_side_door.png",
    cast: ["shen-yan", "lin-he", "a-tuo", "nest-listener"],
    lines: [line("沈砚", "先击退他们，再对付感染者。", "shen-yan")],
    choices: [
      c("b1-1-sonic", "已拿音爆弹", "technical", "B1_1_SONIC", "has_sonic_bomb = true。", {
        requires: { has_sonic_bomb: true },
      }),
      c("b1-1-no-sonic", "未拿音爆弹", "risky", "B1_1_NO_SONIC", "has_sonic_bomb = false。", {
        requires: { has_sonic_bomb: false },
      }),
    ],
  },
  B1_1_SONIC: {
    id: "B1_1_SONIC",
    kind: "scene",
    chapter: "分歧1.1.1：已拿音爆弹",
    phase: "终局",
    title: "对抗局被淹没",
    kicker: "沈砚感染后选择",
    background: "/backgrounds/BG_11_manual_side_door.png",
    cast: ["shen-yan", "lin-he", "a-tuo", "nest-listener"],
    lines: [
      line("旁白", "三人被感染者包围。"),
      line("沈砚", "阿拓，那玩意修好没？", "shen-yan"),
      line("阿拓", "早修好了，而且威力更强，正好给对抗局那帮家伙尝尝威力。", "a-tuo"),
      line("旁白", "阿拓将音爆弹扔向对抗局。"),
      line("旁白", "感染者朝对抗局扑去。"),
      line("旁白", "对抗局被淹没，全员阵亡。"),
      line("旁白", "三人小队也受到感染者攻击，混乱中沈砚为救林禾被抓伤。"),
      line("林禾", "沈队，你被感染了。", "lin-he"),
      line("阿拓", "这下该怎么办？", "a-tuo"),
    ],
    choices: [
      c("use-vaccine-on-self", "给自己使用疫苗", "risky", "E01", "进入结局 E01：异化的希望。", {
        updates: { shenyan_infected: true, shenyan_state: "mutated", vaccine_recovered_by_safezone: false },
        effects: { infection: 80, sample: -40, truth: 15 },
      }),
      c("self-end-after-infection", "自戕，让林禾和阿拓带疫苗回去", "moral", "E02", "进入结局 E02：最后一枪。", {
        updates: { shenyan_infected: true, shenyan_state: "dead", vaccine_recovered_by_safezone: false },
        effects: { infection: 60, team: -16, judgment: 12 },
      }),
    ],
  },
  B1_1_NO_SONIC: {
    id: "B1_1_NO_SONIC",
    kind: "scene",
    chapter: "分歧1.1.2：未拿音爆弹",
    phase: "终局",
    title: "黑潮之后",
    kicker: "进入 E03",
    background: "/backgrounds/BG_11_manual_side_door.png",
    cast: ["shen-yan", "lin-he", "a-tuo", "shao-ji", "nest-listener"],
    lines: [
      line("旁白", "三人被感染者包围。"),
      line("沈砚", "阿拓，边打边撤。", "shen-yan"),
      line("邵戟", "沈砚，尝尝这个。", "shao-ji"),
      line("旁白", "邵戟朝沈砚扔出闪光弹。"),
      line("旁白", "三人小队短暂失去视觉，全员受到感染者攻击。"),
    ],
    choices: [
      c("to-e03", "进入结局 E03：黑潮之后", "risky", "E03", "三人均死在感染者攻击下。", {
        updates: {
          shenyan_state: "dead",
          atok_alive: false,
          linhe_alive: false,
          vaccine_taken_by_opposition: true,
        },
        effects: { infection: 100, team: -80, sample: -50 },
      }),
    ],
  },
  B1_2: {
    id: "B1_2",
    kind: "scene",
    chapter: "分歧1.2：带着疫苗组织撤离",
    phase: "追击",
    title: "西南口撤离",
    kicker: "根据 has_sonic_bomb 分流",
    background: "/backgrounds/BG_11_manual_side_door.png",
    cast: ["shen-yan", "lin-he", "a-tuo"],
    lines: [
      line("沈砚", "疫苗已经拿到手了，不要与他们缠斗。", "shen-yan"),
      line("林禾", "好，西南口可以撤离。", "lin-he"),
      line("阿拓", "走，算许燃这小子走运。", "a-tuo"),
    ],
    choices: [
      c("b1-2-sonic", "已拿音爆弹", "technical", "B1_2_SONIC", "has_sonic_bomb = true。", {
        requires: { has_sonic_bomb: true },
      }),
      c("b1-2-no-sonic", "未拿音爆弹", "risky", "B1_2_NO_SONIC", "has_sonic_bomb = false。", {
        requires: { has_sonic_bomb: false },
      }),
    ],
  },
  B1_2_SONIC: {
    id: "B1_2_SONIC",
    kind: "scene",
    chapter: "分歧1.2.1：已拿音爆弹",
    phase: "终局",
    title: "音爆弹投掷方向",
    kicker: "决定 E04 或 E05",
    background: "/backgrounds/BG_11_manual_side_door.png",
    cast: ["shen-yan", "lin-he", "a-tuo", "nest-listener"],
    lines: [
      line("旁白", "三人被感染者包围。"),
      line("沈砚", "阿拓，那玩意修好没？", "shen-yan"),
      line("阿拓", "早修好了，而且威力更强，正好给这群丑八怪尝尝。", "a-tuo"),
      line("林禾", "目前西南方向感染者最少。", "lin-he"),
    ],
    choices: [
      c("sonic-southwest-linhe", "扔向西南方", "risky", "E04", "进入结局 E04：冷舱里的队长。", {
        updates: {
          sonic_bomb_direction: "southwest",
          shenyan_infected: true,
          shenyan_state: "cryo_sleep",
          vaccine_recovered_by_safezone: true,
        },
        effects: { infection: 55, judgment: -4 },
      }),
      c("sonic-away-linhe", "扔向东南方 / 西北方", "technical", "E05", "进入结局 E05：带回问题的人。", {
        updates: {
          sonic_bomb_direction: "southeast_or_northwest",
          vaccine_recovered_by_safezone: true,
          shenyan_state: "alive",
        },
        effects: { sample: 18, team: 10, coldChain: 8 },
      }),
    ],
  },
  B1_2_NO_SONIC: {
    id: "B1_2_NO_SONIC",
    kind: "scene",
    chapter: "分歧1.2.2：未拿音爆弹",
    phase: "终局",
    title: "冷舱或自戕",
    kicker: "决定 E04 或 E02",
    background: "/backgrounds/BG_16_cryo_chamber.png",
    cast: ["shen-yan", "lin-he", "a-tuo"],
    lines: [
      line("旁白", "三人被感染者包围，陷入战斗。"),
      line("旁白", "沈砚殿后被抓伤。"),
      line("旁白", "小队发现冷舱。"),
    ],
    choices: [
      c("cryo-linhe-no-sonic", "让阿拓修好冷舱，自我冬眠", "technical", "E04", "进入结局 E04：冷舱里的队长。", {
        updates: {
          shenyan_infected: true,
          shenyan_state: "cryo_sleep",
          vaccine_recovered_by_safezone: true,
        },
        effects: { infection: 60, judgment: 8 },
      }),
      c("self-end-linhe-no-sonic", "自戕，让林禾和阿拓带疫苗回去", "moral", "E02", "进入结局 E02：最后一枪。", {
        updates: { shenyan_infected: true, shenyan_state: "dead", vaccine_recovered_by_safezone: false },
        effects: { infection: 70, team: -16 },
      }),
    ],
  },
  P14_2: {
    id: "P14_2",
    kind: "scene",
    chapter: "分歧2：疫苗给阿拓",
    phase: "追击",
    title: "白鸮暴露：阿拓持疫苗",
    kicker: "vaccine_holder = atok",
    background: "/backgrounds/BG_15_transport_workshop_standoff.png",
    cast: ["shen-yan", "lin-he", "a-tuo", "white-owl", "shao-ji"],
    lines: [
      line("旁白", "许燃靠近阿拓。"),
      line("旁白", "林禾发现异常。"),
      line("旁白", "许燃快速拔枪挟持阿拓，退到邵戟身边。"),
      line("沈砚", "许燃？", "shen-yan"),
      line("林禾", "许燃，你果然有问题。", "lin-he"),
      line("邵戟", "白鸮，归队。", "shao-ji"),
      line("许燃", "抱歉，沈队。", "white-owl"),
      line("邵戟", "白鸮，这个人没用，我们只要疫苗。", "shao-ji"),
    ],
    choices: [
      c("atok-saved-branch", "阿拓救过许燃", "moral", "B2_1", "atok_saved_xuran = true。", {
        requires: { atok_saved_xuran: true },
        updates: { vaccine_taken_by_opposition: true, xuran_exposed: true },
      }),
      c("atok-not-saved-branch", "阿拓没有救过许燃", "risky", "B2_2", "atok_saved_xuran = false。", {
        requires: { atok_saved_xuran: false },
        updates: {
          vaccine_taken_by_opposition: true,
          xuran_exposed: true,
          atok_alive: false,
        },
      }),
    ],
  },
  B2_1: {
    id: "B2_1",
    kind: "scene",
    chapter: "分歧2.1：阿拓救过许燃",
    phase: "追击",
    title: "许燃放过阿拓",
    kicker: "根据 has_sonic_bomb 分流",
    background: "/backgrounds/BG_15_transport_workshop_standoff.png",
    cast: ["shen-yan", "lin-he", "a-tuo", "white-owl", "shao-ji"],
    lines: [
      line("旁白", "许燃拿走阿拓身上的疫苗，一脚将阿拓踹回沈砚身边。"),
      line("邵戟", "白鸮，为什么不杀了他？", "shao-ji"),
      line("许燃", "不想浪费子弹。疫苗到手，走吧邵队，感染者要来了。", "white-owl"),
      line("邵戟", "撤退。", "shao-ji"),
      line("沈砚", "阿拓，没事吧？", "shen-yan"),
      line("阿拓", "对不起，沈队，林博士，我弄丢了疫苗。", "a-tuo"),
      line("林禾", "感染者快来了，我们追上对抗局，夺回疫苗。", "lin-he"),
      line("沈砚", "先突围。", "shen-yan"),
    ],
    choices: [
      c("b2-1-sonic", "已拿音爆弹", "technical", "B2_1_SONIC", "has_sonic_bomb = true。", {
        requires: { has_sonic_bomb: true },
      }),
      c("b2-1-no-sonic", "未拿音爆弹", "risky", "B2_1_NO_SONIC", "has_sonic_bomb = false。", {
        requires: { has_sonic_bomb: false },
      }),
    ],
  },
  B2_1_SONIC: {
    id: "B2_1_SONIC",
    kind: "scene",
    chapter: "分歧2.1.1：已拿音爆弹",
    phase: "终局",
    title: "音爆弹投掷方向",
    kicker: "决定 E07 或 E08",
    background: "/backgrounds/BG_11_manual_side_door.png",
    cast: ["shen-yan", "lin-he", "a-tuo", "nest-listener"],
    lines: [
      line("旁白", "三人被感染者包围。"),
      line("沈砚", "阿拓，那玩意修好没？", "shen-yan"),
      line("阿拓", "早修好了，而且威力更强。", "a-tuo"),
      line("林禾", "目前西南方向感染者最少。", "lin-he"),
    ],
    choices: [
      c("sonic-southwest-atok", "扔向西南方", "risky", "E07", "进入结局 E07：失去疫苗，留下沈砚。", {
        updates: {
          sonic_bomb_direction: "southwest",
          shenyan_infected: true,
          shenyan_state: "cryo_sleep",
          vaccine_taken_by_opposition: true,
        },
        effects: { infection: 58, sample: -50 },
      }),
      c("sonic-northeast-atok", "扔向东北方向", "technical", "E08", "进入结局 E08：活着的失败者。", {
        updates: {
          sonic_bomb_direction: "northeast",
          shenyan_state: "alive",
          vaccine_taken_by_opposition: true,
        },
        effects: { team: 8, sample: -50 },
      }),
    ],
  },
  B2_1_NO_SONIC: {
    id: "B2_1_NO_SONIC",
    kind: "scene",
    chapter: "分歧2.1.2：未拿音爆弹",
    phase: "终局",
    title: "失去疫苗，留下沈砚",
    kicker: "进入 E07",
    background: "/backgrounds/BG_16_cryo_chamber.png",
    cast: ["shen-yan", "lin-he", "a-tuo"],
    lines: [
      line("旁白", "三人被感染者包围，陷入战斗。"),
      line("旁白", "沈砚殿后被抓伤。"),
      line("旁白", "小队发现冷舱，阿拓修好冷舱。"),
    ],
    choices: [
      c("to-e07-atok-no-sonic", "进入结局 E07：失去疫苗，留下沈砚", "technical", "E07", "对抗局带走疫苗。", {
        updates: {
          shenyan_infected: true,
          shenyan_state: "cryo_sleep",
          vaccine_taken_by_opposition: true,
        },
        effects: { infection: 64, sample: -55 },
      }),
    ],
  },
  B2_2: {
    id: "B2_2",
    kind: "scene",
    chapter: "分歧2.2：阿拓没有救过许燃",
    phase: "终局",
    title: "两枚铭牌",
    kicker: "进入 E06",
    background: "/backgrounds/BG_15_transport_workshop_standoff.png",
    cast: ["shen-yan", "lin-he", "a-tuo", "white-owl", "shao-ji"],
    lines: [
      line("旁白", "许燃拿走阿拓身上的疫苗，挟持阿拓。"),
      line("邵戟", "白鸮，杀了他。", "shao-ji"),
      line("旁白", "许燃略微犹豫，开枪射杀阿拓。"),
      line("旁白", "阿拓倒在地上。"),
      line("许燃", "疫苗到手，走吧邵队，感染者要来了。", "white-owl"),
      line("邵戟", "撤退。", "shao-ji"),
      line("旁白", "沈砚看着前方阿拓的尸体，又看着后面被枪声吸引来的感染者，压抑悲痛，拉着林禾撤离。"),
      line("林禾", "沈队，我们得夺回疫苗。", "lin-he"),
      line("沈砚", "许燃叛变，阿拓死了，我们只有两个人，先撤退。", "shen-yan"),
      line("旁白", "沈砚和林禾撤退到冷链库。"),
      line("旁白", "撤离路上，沈砚为保护林禾被感染者抓伤。"),
      line("旁白", "沈砚知道自己要异化了。"),
    ],
    choices: [
      c("self-end-tags", "自己开枪终结自己", "moral", "E06", "进入结局 E06：两枚铭牌。", {
        updates: {
          shenyan_infected: true,
          shenyan_state: "dead",
          atok_alive: false,
          vaccine_taken_by_opposition: true,
        },
        effects: { infection: 75, team: -45 },
      }),
      c("linhe-kills-shenyan", "让林禾击毙自己", "moral", "E06", "进入结局 E06：两枚铭牌。", {
        updates: {
          shenyan_infected: true,
          shenyan_state: "dead",
          atok_alive: false,
          vaccine_taken_by_opposition: true,
        },
        effects: { infection: 75, team: -45, truth: 8 },
      }),
    ],
  },
  P14_3: {
    id: "P14_3",
    kind: "scene",
    chapter: "分歧3：疫苗给许燃",
    phase: "追击",
    title: "白鸮暴露：许燃持疫苗",
    kicker: "vaccine_holder = xuran",
    background: "/backgrounds/BG_15_transport_workshop_standoff.png",
    cast: ["shen-yan", "lin-he", "a-tuo", "white-owl", "shao-ji"],
    lines: [
      line("旁白", "许燃靠近林禾准备拔枪。"),
      line("旁白", "林禾发现，也拔枪。"),
      line("旁白", "二者枪指对方。"),
      line("旁白", "许燃带着疫苗，退到邵戟身边。"),
      line("沈砚", "许燃？", "shen-yan"),
      line("林禾", "许燃，你果然有问题。", "lin-he"),
      line("邵戟", "白鸮，归队。", "shao-ji"),
      line("许燃", "疫苗到手，走吧邵队，感染者要来了。", "white-owl"),
      line("邵戟", "撤退。", "shao-ji"),
      line("旁白", "感染者马上靠近。"),
      line("阿拓", "许燃那个忘恩负义的家伙，沈队我们现在该怎么办？", "a-tuo"),
      line("林禾", "沈队，我们得夺回疫苗。", "lin-he"),
      line("沈砚", "先撤退。", "shen-yan"),
    ],
    choices: [
      c("xuran-sonic-branch", "已拿音爆弹", "technical", "B3_1", "has_sonic_bomb = true。", {
        requires: { has_sonic_bomb: true },
        updates: { xuran_exposed: true, vaccine_taken_by_opposition: true },
      }),
      c("xuran-no-sonic-branch", "未拿音爆弹", "risky", "B3_2", "has_sonic_bomb = false。", {
        requires: { has_sonic_bomb: false },
        updates: { xuran_exposed: true, vaccine_taken_by_opposition: true },
      }),
    ],
  },
  B3_1: {
    id: "B3_1",
    kind: "scene",
    chapter: "分歧3.1：已拿音爆弹",
    phase: "终局",
    title: "音爆弹投掷方向",
    kicker: "决定 E07 或 E08",
    background: "/backgrounds/BG_11_manual_side_door.png",
    cast: ["shen-yan", "lin-he", "a-tuo", "nest-listener"],
    lines: [
      line("旁白", "三人被感染者包围。"),
      line("沈砚", "阿拓，那玩意修好没？", "shen-yan"),
      line("阿拓", "早修好了，而且威力更强。", "a-tuo"),
      line("林禾", "目前西南方向感染者最少。", "lin-he"),
    ],
    choices: [
      c("sonic-southwest-xuran", "扔向西南方", "risky", "E07", "进入结局 E07：失去疫苗，留下沈砚。", {
        updates: {
          sonic_bomb_direction: "southwest",
          shenyan_infected: true,
          shenyan_state: "cryo_sleep",
          vaccine_taken_by_opposition: true,
        },
        effects: { infection: 60, sample: -55 },
      }),
      c("sonic-northeast-xuran", "扔向东北方向", "technical", "E08", "进入结局 E08：活着的失败者。", {
        updates: {
          sonic_bomb_direction: "northeast",
          shenyan_state: "alive",
          vaccine_taken_by_opposition: true,
        },
        effects: { team: 8, sample: -55 },
      }),
    ],
  },
  B3_2: {
    id: "B3_2",
    kind: "scene",
    chapter: "分歧3.2：未拿音爆弹",
    phase: "终局",
    title: "失去疫苗，留下沈砚",
    kicker: "进入 E07",
    background: "/backgrounds/BG_16_cryo_chamber.png",
    cast: ["shen-yan", "lin-he", "a-tuo"],
    lines: [
      line("旁白", "三人被感染者包围，陷入战斗。"),
      line("旁白", "沈砚殿后被抓伤。"),
      line("旁白", "小队发现冷舱，阿拓修好冷舱。"),
    ],
    choices: [
      c("to-e07-xuran-no-sonic", "进入结局 E07：失去疫苗，留下沈砚", "technical", "E07", "对抗局带走疫苗。", {
        updates: {
          shenyan_infected: true,
          shenyan_state: "cryo_sleep",
          vaccine_taken_by_opposition: true,
        },
        effects: { infection: 64, sample: -55 },
      }),
    ],
  },
  E01: {
    id: "E01",
    kind: "narration",
    chapter: "结局",
    phase: "终局",
    title: endings.E01.title,
    kicker: "异化的希望",
    background: endings.E01.image,
    cast: [],
    lines: [],
    choices: [],
  },
  E02: {
    id: "E02",
    kind: "narration",
    chapter: "结局",
    phase: "终局",
    title: endings.E02.title,
    kicker: "最后一枪",
    background: endings.E02.image,
    cast: [],
    lines: [],
    choices: [],
  },
  E03: {
    id: "E03",
    kind: "narration",
    chapter: "结局",
    phase: "终局",
    title: endings.E03.title,
    kicker: "黑潮之后",
    background: endings.E03.image,
    cast: [],
    lines: [],
    choices: [],
  },
  E04: {
    id: "E04",
    kind: "narration",
    chapter: "结局",
    phase: "终局",
    title: endings.E04.title,
    kicker: "冷舱里的队长",
    background: endings.E04.image,
    cast: [],
    lines: [],
    choices: [],
  },
  E05: {
    id: "E05",
    kind: "narration",
    chapter: "结局",
    phase: "终局",
    title: endings.E05.title,
    kicker: "带回问题的人",
    background: endings.E05.image,
    cast: [],
    lines: [],
    choices: [],
  },
  E06: {
    id: "E06",
    kind: "narration",
    chapter: "结局",
    phase: "终局",
    title: endings.E06.title,
    kicker: "两枚铭牌",
    background: endings.E06.image,
    cast: [],
    lines: [],
    choices: [],
  },
  E07: {
    id: "E07",
    kind: "narration",
    chapter: "结局",
    phase: "终局",
    title: endings.E07.title,
    kicker: "失去疫苗，留下沈砚",
    background: endings.E07.image,
    cast: [],
    lines: [],
    choices: [],
  },
  E08: {
    id: "E08",
    kind: "narration",
    chapter: "结局",
    phase: "终局",
    title: endings.E08.title,
    kicker: "活着的失败者",
    background: endings.E08.image,
    cast: [],
    lines: [],
    choices: [],
  },
};

export const scriptStartNodeId: ScriptNodeId = "P00";

export const statLabels: Record<StatKey, string> = {
  truth: "真相",
  sample: "样本",
  team: "队伍",
  exposure: "暴露",
  coldChain: "冷链",
  judgment: "判断",
  infection: "感染",
};
