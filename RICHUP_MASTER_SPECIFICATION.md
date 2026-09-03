# 🏆 RICHUP.IO COMPLETE REFERENCE & ESTATE EMPIRE SYSTEM SPECIFICATION

> **Document Status:** Master Architecture & UX Parity Specification  
> **Target Standard:** Richup.io Professional Board-Game UX Standard  
> **Application:** Estate Empire (Server-Authoritative Monopoly Web Platform)

---

## 📋 Executive Overview

**Richup.io** is the gold standard for browser-based digital board games. It combines real-time WebSockets, tight game state synchronization, dense turn-based UI controls, and zero-friction multiplayer room codes.

This document serves as the **Master Specification** for **Estate Empire**, detailing:
1. **Richup.io Complete Analysis** (UI/UX layout, game loop, network topology, visual hierarchy, economy).
2. **Estate Empire Architecture** (Server-authoritative Node/Socket.io backend + React/Zustand client).
3. **Core Feature Parity Matrix** (What is built, how it functions, and technical integration points).

---

## 🎨 1. Richup.io Interaction & UX Model Analysis

### 1.1 Visual Hierarchy & Screen Structure
Richup.io avoids multi-page page transitions during gameplay. Instead, it utilizes a **single-canvas persistent board layout** with non-blocking drawers and modals:

```
+-----------------------------------------------------------------------+
|  TOP BAR: Room Code | Round | Turn Indicator | Sound | Exit         |
+-----------------------------------------------------------------------+
|  PLAYER STRIP: Horizontally scrollable player net worth & token status |
+------------------+----------------------------------+-----------------+
|  LEFT SIDEBAR:   |           CENTER BOARD:          | RIGHT SIDEBAR:  |
|  - Dice Box      |   - 40-Tile Monopoly Grid        | - Construction  |
|  - Log Feed      |   - Center watermark / cards     | - Portfolio     |
|  - Turn Timer    |   - Floating Action Control Bar  | - Mortgage/Sell |
+------------------+----------------------------------+-----------------+
|  FLOATING CONTROLS: [Roll Dice] [Buy Property] [Auction] [Trade] [End]|
+-----------------------------------------------------------------------+
```

### 1.2 Key UX Principles copied from Richup.io
1. **Context-Aware Bottom Action Bar:** Action buttons (Roll, Buy, Auction, Trade, End Turn) float dynamically in the lower central area depending on turn state.
2. **Compact Player Ribbon:** Player stats (money, net worth, properties owned color chips, jail status) are shown in a unified top strip.
3. **Zero-Friction Multiplayer Rooms:** 6-character room codes generated instantly, allowing one-click copy and instant join via direct link (`?join=XXXXXX`).
4. **Server-Authoritative Turn Engine:** Client renders state received via Socket.io events; all actions validate server-side to prevent cheating or out-of-turn actions.
5. **Live Bidding Auctions:** When a player lands on an unowned tile and declines purchase, an interactive auction modal opens for all non-bankrupt players.
6. **Dual-Pane Balanced Trading:** Side-by-side OFFER vs REQUEST interface with cash adjustment sliders and visual property chips.

---

## ⚙️ 2. Core Feature Parity Matrix

| Feature Category | Richup.io Standard | Estate Empire Implementation | Status |
| :--- | :--- | :--- | :--- |
| **Networking** | Socket.io WebSockets | Server-Authoritative Express + Socket.io Server (`/server/index.js`) | ✅ Implemented |
| **Room System** | 6-Character Code | `roomManager.js` with hosting, joining, bot population | ✅ Implemented |
| **AI Bot Agent** | Automated Decision Bot | `server/botAI.js` (Buys properties, bids in auctions, pays bail) | ✅ Implemented |
| **Audio Engine** | Synthesized SFX | Zero-dependency Web Audio API Synthesizer (`src/game/soundManager.ts`) | ✅ Implemented |
| **Board Layout** | 40 Standard Tiles | 40 Tiles with standard prices, rents, color groups, rail, tax, utilities | ✅ Implemented |
| **Top Player Strip** | Dynamic player stats | `PlayerStrip.tsx` with color chips, active turn glow, jail indicators | ✅ Implemented |
| **Action Bar** | Floating bottom bar | Dynamic floating bottom control bar in `GamePage.tsx` | ✅ Implemented |
| **Trade Engine** | Split Give/Receive | `TradeDrawer.tsx` with offer/request money & property selection | ✅ Implemented |
| **Auction Machine** | Real-time bidding | `AuctionModal.tsx` + server state machine for bidding/passing | ✅ Implemented |
| **Housing Rules** | House/Hotel limits | Bank resource tracking (`bankHouses: 32`, `bankHotels: 12`) | ✅ Implemented |
| **Cosmetics Store** | Tokens & themes | Integrated `StorePage.tsx` for cosmetic customization | ✅ Implemented |

---

## 🛠️ 3. Technical Architecture Overview

### 3.1 Backend Server (`/server`)
- **`index.js`**: Socket.io event router (`CREATE_ROOM`, `JOIN_ROOM`, `ROLL_DICE`, `BUY_PROPERTY`, `DECLINE_PROPERTY`, `PLACE_BID`, `PASS_BID`, `PROPOSE_TRADE`, `END_TURN`).
- **`roomManager.js`**: Manages room lifecycles, player disconnections, and lobby state.
- **`gameEngine.js`**: Pure game logic (dice rolling, tile resolution, rent calculation, mortgage calculation, debt settlement).
- **`botAI.js`**: Automated agent logic executed server-side when bot turns trigger.

### 3.2 Frontend Client (`/src`)
- **`state/gameStore.ts`**: Zustand global game state synchronized via `GAME_STATE_UPDATE` socket events.
- **`services/socketService.ts`**: Client WebSocket bridge for real-time multiplayer communication.
- **`pages/`**:
  - `SetupPage.tsx`: Main menu (Create Online, Join Code, Hotseat).
  - `LobbyPage.tsx`: Room lobby with ready status, bot addition, and code sharing.
  - `GamePage.tsx`: Single-canvas board game UI.
  - `StorePage.tsx`: Cosmetic store.
  - `VictoryPage.tsx`: Victory statistics.
- **`components/`**:
  - `Board.tsx` & `BoardTile.tsx`: Responsive 40-tile board grid.
  - `PlayerStrip.tsx`: Top player status ribbon.
  - `DiceDisplay.tsx`: Animated SVG dice.
  - `TradeDrawer.tsx`: Dual-pane trade system.
  - `AuctionModal.tsx`: Live bidding interface.
  - `BuildPanel.tsx`: House/hotel construction drawer.
  - `PropertyDrawer.tsx`: Tile inspector drawer.

---

## 🚀 4. How to Run Estate Empire

```bash
# 1. Start Server (Backend)
cd server
npm install
node index.js   # Running on http://localhost:3001

# 2. Start Frontend (Client)
# In project root:
npm install
npm run dev     # Running on http://localhost:5175
```

---
*Estate Empire — Rebuilt for professional Monopoly multiplayer performance.*
