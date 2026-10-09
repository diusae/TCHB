<div align="center">

# The Crims Helper (TCB)

![Banner](https://i.imgur.com/DUHD8Ny.gif)

[![YouTube](https://img.shields.io/badge/YouTube-Watch-red?logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=6__Zd4GXCmU)
[![Version](https://img.shields.io/badge/version-1.0.5-blue)]()
[![License](https://img.shields.io/badge/license-Open%20Source-green)]()
[![Languages](https://img.shields.io/badge/languages-7-orange)]()
[![Download](https://img.shields.io/badge/Download-v1.0.2-brightgreen?logo=github&logoColor=white)](https://github.com/diusae/TCHB/releases/tag/tcbv1.0.2)

**Türkçe • English • Español • Français • Português • Polski • العربية**

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
<summary><b>v1.0.5</b> — Click to expand</summary>
  
- **Split Stamina Refill** — energy refill is now two independent modules: **Stamina (Night Club)** and **Stamina (Tickets)**. Each has its own toggle, its own execution-order slot, and falls back to the other if it fails.
- **Night Club Refill — DOM Based** — clicks the real in-game button `#robbery-stamina-refill` on `/robberies`, parses the fee directly from the button label, and checks it against your cash limit. Falls back to the legacy nightclub API if the button is missing.
- **Ticket Refill — 10 Tickets per Call** — now sends `min(10, tickets - ticketReserve)` every cycle instead of just enough to top up. Ticket reserve is subtracted up front, so reserved tickets are never spent.
- **Retry Between Modules** — if Night Club refill fails (fee over limit, DOM button missing, API refusal), the execution order automatically falls through to the Tickets module in the same cycle, and vice-versa.
- **Assault Pre-Check** — new option **AI Bot min. Stamina (%)** (default 90). Before attacking an AI bot, if stamina is below this %, the bot first tries to refill with tickets, then falls back to Night Club. Prevents wasted hits with low stamina.
- **Gang Robbery HP Threshold — UI Control** — new option **Gang robbery min. HP (%)** (default 30). Bot skips gang robberies if HP is below this %. Previously hard-coded and users couldn't join gang robberies while low HP.
- **Order Presets** — three one-click buttons in the Order tab: **Full Order**, **AI Bot Focus**, and **Robbery Focus**. Each preset rewrites the execution order AND enables/disables the correct modules in one shot. No more manual reordering when switching play styles.
- **New Config Key** — `autoStaminaTickets: true` added to DEFAULTS. Older saves are merged safely; the new key defaults to ON so existing users keep refilling stamina out of the box.
- **New Execution Order Key** — `stamina_tickets` is now a first-class entry in `executionOrder`, `EXECUTION_MODULES`, `EXEC_LABEL_KEY` and `CHECKBOX_MAP`. Drag & drop, ▲▼ buttons and Enable All / Disable All work on it like any other module.
- **Removed Legacy Early-Exit** — the old eager stamina check inside `oneCycle()` that ran before the execution-order loop was removed. Stamina is now handled entirely by the ordering system.
- **Stamina Capacity Fix** — `staminaPct()` and `staminaCapacity()` were forcing 100 when the points-system flag was true, causing the panel to show full stamina (114/100) while the game reported 114/150. Both functions now prefer the actual `stamina_max` from the API, so displayed values and refill decisions match the game.
- **Gang Robbery Safety Margin** — `gangRobberySafetyMargin` default updated from 0.9 to 1.0 in DEFAULTS.
- **Russian Language Added** — full Russian (ru) translation covering all sections, tooltips, log lines, combat messages and status strings. The language picker now shows 8 languages: TR, EN, ES, FR, PT, PL, AR, RU.
- **Contact Button** — a new Contact button was added to the top-right of the panel header. It opens the UnKnoWnCheaTs forum thread in a new tab with `noopener,noreferrer`. Label is translated to all 8 languages (TR: İletişim, EN: Contact, RU: Связь, AR: اتصال, …).
- **UI — Main Routine Panel** — the single "Stamina Refill" row in Automation → Main Routine was replaced with two separate toggle rows, each with its own tooltip. Switch state stays in sync across Automation, Execution Order and the Enable All / Disable All bulk buttons.
- **CSS Cleanup** — removed duplicate `.header-actions` and `.contact-btn` rules that caused specificity conflicts. The Contact button now renders as a compact pill using a single `all: unset` rule set.

</details>

<details>
<summary><b>v1.0.4</b> — Click to expand</summary>
  
- **Robbery Throttle Fixed** — robbery, gang robbery, assault and stamina modules no longer have a 30-second cooldown. Anti-spam is handled entirely by `activityMinGapMs` (3-5s default).
- **Selective Throttling** — only long-period modules (detox, university, factories, laboratory, hookers, airport, bank, dice, levelup, training) are throttled. Robbery / gang / assault / stamina run every cycle.
- **Fresh State for Robbery** — the robbery module now re-fetches `/api/v1/robberies` before executing, so stamina changes from a refill are reflected immediately. Removes the "no safe robbery" false negatives right after a refill.
- **Panel Not Opening — FIXED** — fixed a SyntaxError caused by a duplicate `normalizedExecutionOrder()` declaration and a misplaced `const THROTTLED` inside the `EXEC_LABEL_KEY` object. These errors crashed the whole content script and made the launcher and panel invisible.
- **EXECUTION_KEYS Restored** — the `EXECUTION_KEYS` constant that was accidentally removed in v1.0.3 is back. It is required by the execution-order normalizer.
- **applyLanguage Cleanup** — a duplicated inner `applyLanguage()` function that broke language switching (UI not refreshing, checkboxes going out of sync) has been removed.
- **Default Order Updated** — Robbery → Detox → Assault → Gang → Level Up → Recovery → University → Factories → Laboratory → Hookers → Airport → Bank → Dice → Training. This mirrors the natural priority for most players.
- **Duplicate-Function Guard** — a code cleanup pass on the execution-order block prevents future merge accidents of the same kind.

</details>

<details>
<summary><b>v1.0.3</b> — Click to expand</summary>
  
- **New Tab: Execution Order** — the run order is now its own category next to Assassination; drag & drop plus **Enable All** / **Disable All** buttons added. Enabled modules run top to bottom; the first ready one executes and the cycle ends.
- **New Tab: Assassination** — AI Bot Fight, Victim Filters and Character Criteria merged here. Below them a live *filtered victims* history.
- **Account Investigation** — `check-investigation` now has a real handler in `bridge.js`. If unsupported, the button hides itself automatically.
- **Anti-ban Mutex** — `activity.run` fixed with a reentrant counter; same-type nested calls can no longer run in parallel.
- **TTA Cap** — `doHuntBot` now works with a 2500ms upper bound (late hits prevented).
- **Country Quick Add** — 60+ country codes can be added to the victim filter with a single click.
- **Filtered Counter** — live "Filtered" counter in the stats panel.
- **Investigation Cache TTL** — 30 minutes; reset on every start.
- All 7 languages (TR, EN, ES, FR, PT, PL, AR) updated with the new sections, tooltips and execution-order translations.

</details>

<details>
<summary><b>v1.0.2</b> — Click to expand</summary>
  
- **Full Translations** — all 7 languages (TR, EN, ES, FR, PT, PL, AR) now include the new sections, tooltips, log lines and status messages.
- **University** — auto joins the active class, gives presence, completes it. Optional auto-enroll with cash or credits.
- **Factories** — auto-collects finished production and performs maintenance when needed.
- **Laboratory** — manages the production queue: collects completed batches and starts new ones with your selected components.
- **ChangeLog** — added a dedicated ChangeLog tab inside the panel.
- **Robbery safety default changed to 100%** — the bot now starts with the robbery safety margin at 100% instead of 90%. Previously, the 90% default caused the bot to skip robberies the game itself marked as 100% safe for the player (for example, "Fas Limanı" being skipped in favor of a lower-tier robbery). You can still lower it manually under **Strategy → Robbery** at any time.
- Config safely merges older saves missing the new fields.

 </details>

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

## Credits:

- https://github.com/grimaldello/the-crims-italian-bot-v2
- https://github.com/dan606/TheCrimsRubberyBot
