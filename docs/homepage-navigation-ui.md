# Homepage Navigation UI

## Goal

Keep the homepage navigation and footer link set focused for the merge-ready static site.

## Scope

- Top navigation social area.
- Hero copy layout after removing the community button.
- Project introduction section after removing the buy button.
- Footer icon area.

## Navigation Set

- Keep X, Four.meme, language toggle, and Deposit.
- Remove GMGN and Dexscreener from the top and footer.
- Use the Four.meme official app icon in the same white square button style as the existing icon buttons.
- Language toggle uses a globe icon instead of visible EN/CN text.
- Deposit is the rightmost navigation entry, uses uppercase `DEPOSIT`, does not include a trailing icon, and the top navigation instance has a subtle animated glow/sheen to make the action more visible.
- Top navigation is visible by default only at the top of the first viewport. Any downward scroll hides it; scrolling up shows it as the compact fixed header.
- Runtime behavior keeps scroll DOM writes state-based instead of writing transform/classes every scroll tick. Hero-only visual effects pause once the user scrolls beyond the first viewport.

## Hero Layout

- Remove the central community button.
- Merge the two hero copy blocks into a single bottom marquee. The ticker repeats the combined signal message with star and emoji accents so the first viewport keeps movement without relying on backend data.
- Preserve the existing animated hero art and text styling.
- Add an intermittent signal-fault overlay across the full first viewport. It should be short and periodic, while the hero Bibendum art keeps a slight RGB/filter response; include a reduced-motion fallback.

## Project Intro

- Remove the Buy `$MEMEchelin` button from the project introduction section.
- Add a staking summary strip between the dashboard preview and project introduction with total staked, APY yield, and a Deposit action. The strip exposes a future API hook through `data-staking-endpoint`; when no endpoint is configured, it uses local fallback display values.
- Animate the total staked value with a subtle periodic per-digit vertical jump. The displayed amount stays complete and unchanged unless a future API payload updates it.
- Keep the explanatory copy and badge content.

## Brand Letter Row

- Add the project `fav.png` logo icon before the large `MEMEchelin` letter row so the brand mark appears before the wordmark sequence.

## Footer

- Footer navigation mirrors the top navigation set and order: X, Four.meme, language toggle, Deposit.
