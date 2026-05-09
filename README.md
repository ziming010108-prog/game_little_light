# game_little_light

《微孔：疫苗坠落》是一个末世题材剧情推理卡牌生存游戏项目。仓库包含两部分：

- 主游戏 MVP：Vite + React 实现的可交互剧情卡牌游戏。
- 游戏介绍 Demo：位于 `game_intro_demo/` 的静态介绍页。

玩家带领沈砚小队进入废弃微孔过滤工厂，寻找坠毁运输机上的疫苗原液的故事。

## 运行

```bash
npm install
npm run dev
```

当前开发服务器会显示本地 URL，例如 `http://localhost:5174/`。

开发模式入口：

- 主游戏：`/`
- 游戏介绍 Demo：`/game_intro_demo/`

## 构建

```bash
npm run build
```

构建后会生成：

- `dist/`：主游戏生产构建。
- `dist/game_intro_demo/`：随主游戏一起发布的介绍 Demo。

## 内容范围

- 首页主视觉和开始流程。
- 5 章、10 张事件卡。
- 18 张线索卡，按图集裁切显示。
- 人物档案，包括沈砚、林禾、阿拓、许燃、白鸮、灰隼、邵戟、巢声者。
- 真相、样本、队伍、暴露、冷链、林禾判断、沈砚感染等数值。
- 终局选择和双结局。

## 素材

素材已放在 `assets/` 下，并由 Vite 作为静态资源目录使用。详细索引见 `assets/ASSET_INDEX.md`。
