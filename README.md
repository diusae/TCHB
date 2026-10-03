<div align="center">

# The Crims Helper (TCB)

**The Crims için ücretsiz, açık kaynak tarayıcı botu — 7 dil destekli**

![Banner](https://i.imgur.com/IARdN3q.gif)

[![YouTube](https://img.shields.io/badge/YouTube-Watch-red?logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=6__Zd4GXCmU)
[![Version](https://img.shields.io/badge/version-1.0.2-blue)]()
[![License](https://img.shields.io/badge/license-Open%20Source-green)]()
[![Languages](https://img.shields.io/badge/languages-7-orange)]()

</div>

---

## ⚠️ WARNING

> **I am not responsible for anything that may happen to you or your account.**
> Using this bot is entirely at your own risk. The Crims staff may detect automated activity and permanently ban any account that has used this tool — even retroactively. You may lose your progress, items, credits, or the account itself, with no refund or restoration. By installing or running it, you accept full responsibility for any consequence — bans, investigations, lost items, or attacks received while the bot is idle in public rooms. **If you do not agree with this warning, do not use the bot.**

---

## Usage

1. Download and extract the archive.
2. Open Opera / Chrome / Edge (any Chromium-based browser) → go to `chrome://extensions` → enable **Developer mode**.
3. Click **Load unpacked** and select the extracted folder.
4. Open **The Crims** website and log in to your account.
5. Click the extension icon in the toolbar (or the launcher button in the bottom-right corner) to open the panel.
6. Press **Start** to run the bot.

---

## Features

### Main Routine
- **Auto Robbery** — picks the strongest safe robbery within your power margin
- **Gang Robbery** — auto-accepts invites and executes active gang robberies
- **Stamina Refill** — refills via tickets or rave party when below threshold
- **AI Bot Fight** — hunts AI bots below your assault power margin
- **Auto Detox** — detoxes when addiction reaches the configured threshold
- **Auto Level Up** — requests level-up once all requirements are met
- **Auto Training** — starts available workouts from crime level 3 onwards
- **University** — auto joins the active class, gives presence, completes it. Optional auto-enroll (cash or credits)
- **Factories** — auto-collects finished production and performs maintenance when needed
- **Laboratory** — manages production queue: collects completed batches and starts new ones with your selected components

### Timing & Anti-Ban
- **3 Presets** — Safe / Medium / Fast one-click timing profiles
- **Min/Max action delay** — robbery / stamina transitions
- **Min/Max cycle delay** — TaskRunner loop interval
- **Min/Max activity gap** — random wait between different action types

### Inventory
- Auto-use item by ID (loaded via Sync)
- Trigger modes: *low HP*, *before Robbery/Assault*, or *both*
- Configurable HP threshold (%)

### Airport
- Auto-collect arrived cargo
- Auto-buy cheapest cargo on empty runways
- Max cash per cargo
- Cash reserve kept after purchase

### Income & Bank
- Auto-collect hooker earnings above minimum
- Auto free dice roll
- Auto-deposit excess cash to bank
- Configurable cash reserve + minimum deposit

### Robbery
- Filter: All / Cash only / Stocks / Events / Cash + Drugs & Components
- Robbery safety margin (only robs within a % of your power)
- **Default safety margin is 100%** — the bot picks the strongest affordable robbery, matching the game's own safety indicator

### Stamina Recovery
- Refill trigger threshold (%)
- Target stamina (%)
- Ticket refill target + minimum ticket reserve
- Cash limit per refill (rave party / refill)
- Toggle ticket usage on/off
- Allow unsafe public raves (optional)

### Combat
- Minimum HP before attacking
- Combat safety margin (only attacks bots within a % of your power)
- **Victim Filters** — blacklist / whitelist by username, ID or country
- **Character Criteria** — per-class level and respect ranges (Businessman, Broker, Dealer, Hitman, Pimp, Robber, Gangster)

### Prison
- Auto cash bribe out of prison
- Maximum bribe amount

### Hospital
- Addiction threshold for auto-detox

### Execution Order
- Reorder the module execution sequence with ▲▼ buttons
- Enabled modules run top to bottom; the first ready one executes, then the cycle ends
- Order is saved between sessions

### Account Investigation
- One-click **Check Account** button scans `localStorage` + Vue store for anti-cheat investigation flags
- Auto-check runs when **Start** is pressed; shows a confirmation dialog if the account is flagged

### Interface
- Live stats panel — Player, Level, Stamina, Tickets, HP, Robbery Power, Assault Power, Cycle count
- Action / Cycle / Error counters + Runtime timer
- Activity log tab
- Combat rewards log tab (with rewards, HP/cash lost)
- **Multi-language support** — TR, EN, ES, FR, PT, PL, AR (RTL supported)
- Clean shadow-DOM panel that doesn't interfere with the game
- In-page launcher button in the bottom-right corner
- Toolbar icon toggle for quick open/close
- Config auto-saved and restored on next visit
- **ChangeLog tab** inside the panel

---

## Changelog

<details>
<summary><b>v1.0.2</b> — Click to expand</summary>
  
- **Full Translations** — all 7 languages (TR, EN, ES, FR, PT, PL, AR) now include the new sections, tooltips, log lines and status messages.
- **University** — auto joins the active class, gives presence, completes it. Optional auto-enroll with cash or credits.
- **Factories** — auto-collects finished production and performs maintenance when needed.
- **Laboratory** — manages the production queue: collects completed batches and starts new ones with your selected components.
- **ChangeLog** — added a dedicated ChangeLog tab inside the panel.
- **Robbery safety default changed to 100%** — the bot now starts with the robbery safety margin at 100% instead of 90%. Previously, the 90% default caused the bot to skip robberies the game itself marked as 100% safe for the player (for example, "Fas Limanı" being skipped in favor of a lower-tier robbery). You can still lower it manually under **Strategy → Robbery** at any time.
- Config safely merges older saves missing the new fields.

- </details>

<details>
<summary><b>v1.0.1</b> — Click to expand</summary>

- Added 7 languages (TR, EN, ES, FR, PT, PL, AR)
- Added Victim Filters (blacklist / whitelist by username, ID, country)
- Added Character-based attack criteria (level / respect ranges per class)
- Added Account Investigation check + auto-check on Start
- Safely merges older saved configs missing the new fields

</details>

<details>
<summary><b>v1.0.0</b> — Click to expand</summary>

- Initial release

</details>

---

## 🚧 Upcoming Update — v1.0.3

> **This version has not been released yet.** Preview of what's coming.

- **Execution Order** — reorder how the bot cycles through modules with ▲▼ buttons. Enabled modules run top to bottom; the first ready one executes, then the cycle ends.

---

## Credits:

- https://github.com/grimaldello/the-crims-italian-bot-v2
- https://github.com/dan606/TheCrimsRubberyBot
