# Dashboard Terminal Preview UI

## Goal

Convert the homepage dashboard preview from a mock API-driven block into a pure front-end animated showcase. The section should look like MEMEchelin is receiving live backend signal data, but it must not fetch or depend on backend data.

## Target Page And User Task

- Target page: `index.html`
- Target area: existing `#dashboard-preview`
- User task: quickly understand that MEMEchelin is an AI Meme signal engine scanning BNB Chain, filtering risk, scoring momentum, outputting signals, and feeding the treasury flywheel.

## Information Structure

- Header: keep the current dashboard title and copy; move the engine-loop summary into compact top-right status text.
- Metric cards: render static simulated system metrics from front-end data.
- Signal panel: replace row-style latest signals with a full-width terminal-like strategy-running stream.
- Status panel: remove the separate status card; the engine-loop status lives in the header as small text.

## Design Tokens

- Reuse existing MEMEchelin colors: `--yellow`, `--pink`, `--pinkHover`, `--background`, `--card-background`.
- Terminal text uses monospace fallback with compact line height.
- Terminal channels use compact inline icons plus animated glyphs to improve scanability and make the stream feel active.
- Status colors are limited to existing accent colors plus subdued white for terminal metadata.
- The dashboard shell uses a slow breathing gradient border to signal system activity without competing with terminal content.

## Component Boundaries

- `index.html`: semantic shell and CSS for terminal layout.
- `js/home-dashboard.js`: owns simulated data, line generation, DOM rendering, and animation timing.
- No `files/api/home-dashboard.json` dependency remains.

## State And Interaction

- Initial state: immediately renders only non-thinking terminal lines and stops before the first agent reasoning event.
- Running state: appends one simulated terminal line at a steady interval and keeps the newest lines visible.
- Simulated chain activity can include shortened wallet actors, for example `0x8b71...A421`, to imply that a wallet initiated a transaction without exposing a full address.
- Simulated agent reasoning appears as lightweight `AGENT thinking...` lines between signal outputs. These lines pause longer, then emit an `AGENT` conclusion line about momentum, liquidity, risk, or signal scoring before the stream continues.
- Agent message/detail text uses a typewriter effect while it is thinking or reporting a conclusion; the stream waits long enough for that line to finish before printing the next event.
- Some normal signal lines also include a short idle pause after output, so the stream feels like it is waiting for confirmations rather than printing at a fixed speed.
- CTA: removed entirely; no dashboard navigation is exposed from this static preview.
- Failure state: not needed because there is no external data dependency.

## Responsive Strategy

- Desktop: terminal panel occupies the full row beneath the metric cards.
- Mobile: panels stack vertically; terminal lines wrap within the panel.
- Terminal area has a stable minimum height so new lines do not shift the surrounding layout.

## Accessibility

- Terminal stream uses `aria-live="polite"` on the message/status text only; the constantly changing line list is not announced line by line.
- Text remains real DOM text, not canvas or image.

## Performance

- No fetch, polling, or external dependency.
- Wallet addresses are static simulated strings and are always shortened in the UI.
- Keep a fixed maximum number of terminal lines in the DOM.
- Animation uses a single timeout loop scoped to the dashboard section, with longer waits for thinking events and occasional short idle pauses.

## Acceptance Criteria

- No `查看实时看板` / `View Live Dashboard` button remains in the dashboard preview.
- No top-right `模拟运行中` / `Simulation running` label remains.
- The dashboard preview does not reference `files/api/home-dashboard.json`.
- The strategy stream occupies the full dashboard row and displays terminal-style simulated MEMEchelin system lines.
- The `引擎闭环 / AI / 感知、决策、执行、再循环` status appears as compact top-right text.
- The signal panel label is `策略运行中`, with no separate running-status sentence.
- The stream includes shortened wallet transaction actors, agent thinking lines, conclusion lines, and uneven pauses.
- The terminal stream updates automatically without layout jumps.
- The dashboard shell border has a slow color-gradient breathing effect.
- Removed mock API assets are cleaned up after the implementation.
