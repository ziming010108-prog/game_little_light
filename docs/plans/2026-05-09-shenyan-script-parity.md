# Shenyan Script Parity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the Shen Yan route so the playable game follows `沈砚线_游戏脚本文件_v0.2.md` node-for-node and exposes the script variables directly.

**Architecture:** Replace the compressed linear event list with a script node graph keyed by the Markdown node IDs (`P00`, `P06A`, `P14-1`, etc.). Store route flags in explicit `RouteVariables`, and let the React runtime navigate by `next` node IDs with conditional choices. Add a route validation script that enumerates all playable paths and proves E01-E08 are reachable.

**Tech Stack:** React 19, TypeScript, Vite, Node validation script using the local `typescript` package.

---

### Task 1: Replace Data Model

**Files:**
- Modify: `src/gameData.ts`

**Steps:**
1. Define `RouteVariables`, `ScriptNode`, and graph-based `ScriptChoice`.
2. Port every script node from `P00` through `P14`, including black-screen narration nodes and branch nodes.
3. Port E01-E08 ending text from the script.
4. Keep existing character, clue, stat, and asset references where useful.

### Task 2: Refactor Runtime

**Files:**
- Modify: `src/App.tsx`

**Steps:**
1. Replace `eventIndex` navigation with `nodeId` navigation.
2. Apply choice variable updates through `RouteVariables`.
3. Filter choices by variable conditions.
4. Render narration, scene, choice, and ending nodes with the existing visual novel UI.

### Task 3: Add Route Validation

**Files:**
- Create: `scripts/validateRoutes.mjs`
- Modify: `package.json`

**Steps:**
1. Load `src/gameData.ts` through TypeScript transpilation.
2. Traverse all choices from `P00`.
3. Assert every ending E01-E08 is reachable.
4. Assert the old synthetic `P15` node no longer exists.

### Task 4: Verify

**Commands:**
- `npm run build`
- `npm run validate:routes`

