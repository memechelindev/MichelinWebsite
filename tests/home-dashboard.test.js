const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const {
  applyPayload,
  formatApy,
  formatFullUsd,
} = require('../js/staking-summary.js');

const {
  createTerminalLine,
  formatWalletAddress,
  getMotionGlyph,
  getTerminalIcon,
  getInitialTerminalEvents,
  getSimulatedDashboardData,
  getTerminalDelay,
  getTerminalEventSequence,
} = require('../js/home-dashboard.js');

const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const whoSectionHtml = indexHtml.slice(indexHtml.indexOf('<section id="who"'), indexHtml.indexOf('<section id="events"'));
const depositGlowKeyframes = indexHtml.slice(indexHtml.indexOf('@keyframes depositButtonGlow'), indexHtml.indexOf('@keyframes depositButtonSheen'));

test('provides simulated dashboard data without backend fields', () => {
  const data = getSimulatedDashboardData();

  assert.equal(data.stats.length, 4);
  assert.equal(data.status.value, 'AI');
  assert.equal(Object.hasOwn(data, 'ctaHref'), false);
  assert.equal(Object.hasOwn(data, 'endpoint'), false);
  assert.ok(data.terminalEvents.length >= 6);
  assert.ok(data.terminalEvents.some((event) => event.walletActor));
  assert.ok(data.terminalEvents.some((event) => event.level === 'thinking'));
  data.terminalEvents
    .filter((event) => event.level === 'thinking')
    .forEach((event) => {
      assert.match(event.conclusion, /score|rating|risk|momentum|liquidity/i);
    });
});

test('creates terminal lines from project signal events', () => {
  const line = createTerminalLine({
    channel: 'BNB-SCAN',
    message: 'meme noise sampled',
    detail: 'liquidity delta tracked',
    level: 'scan',
  }, 42);

  assert.equal(line.channel, 'BNB-SCAN');
  assert.equal(line.message, 'meme noise sampled');
  assert.equal(line.detail, 'liquidity delta tracked');
  assert.equal(line.level, 'scan');
  assert.equal(line.icon, '◉');
  assert.equal(line.motion, '∙∙∙');
  assert.match(line.time, /^\d{2}:\d{2}:\d{2}$/);
  assert.equal(line.id, 'signal-42');
});

test('marks agent lines for typewriter rendering with an icon', () => {
  const line = createTerminalLine({
    channel: 'AGENT',
    message: 'thinking...',
    detail: 'scoring wallet flow and liquidity depth',
    level: 'thinking',
  }, 8);

  assert.equal(line.icon, '◆');
  assert.equal(line.motion, '...');
  assert.equal(line.typewriter, true);
  assert.equal(getTerminalIcon('TX', 'signal'), '⛓');
  assert.equal(getMotionGlyph('TX', 'signal'), '↝');
});

test('formats wallet addresses as shortened on-chain actors', () => {
  assert.equal(formatWalletAddress('0x5fA212B8bD4416fB1cC92003F0F2D66D08e2D317'), '0x5fA2...D317');
});

test('includes shortened wallet actors in transaction terminal lines', () => {
  const line = createTerminalLine({
    channel: 'TX',
    message: 'swap intent observed',
    detail: 'routing into BNB meme pool',
    level: 'signal',
    wallet: '0x8b71cA37B46095e0E78d5E61f7a2c0B988f3A421',
  }, 7);

  assert.equal(line.actor, '0x8b71...A421');
  assert.equal(line.message, '0x8b71...A421 swap intent observed');
});

test('pauses after agent thinking and emits a conclusion before continuing', () => {
  const sequence = getTerminalEventSequence([
    {
      channel: 'AGENT',
      message: 'thinking...',
      detail: 'scoring wallet flow and liquidity depth',
      conclusion: 'signal score 82; risk rating controlled',
      level: 'thinking',
    },
    { channel: 'LIQUID', message: 'LP shift tracked', detail: 'slippage window stable', level: 'scan' },
  ]);

  assert.equal(sequence[0].level, 'thinking');
  assert.equal(sequence[1].channel, 'AGENT');
  assert.equal(sequence[1].level, 'conclusion');
  assert.equal(sequence[1].message, 'signal score 82; risk rating controlled');
  assert.equal(sequence[2].channel, 'LIQUID');
  assert.ok(getTerminalDelay(sequence[0]) > getTerminalDelay(sequence[2]));
  assert.ok(getTerminalDelay(sequence[1]) < getTerminalDelay(sequence[0]));
});

test('does not prefill thinking events before the scheduler can pause', () => {
  const sequence = getTerminalEventSequence([
    { channel: 'BNB-SCAN', message: 'new meme pair detected', detail: 'liquidity delta sampled', level: 'scan' },
    { channel: 'TX', message: 'swap intent observed', detail: 'routing into BNB meme pool', level: 'signal' },
    {
      channel: 'AGENT',
      message: 'thinking...',
      detail: 'weighing momentum against liquidity risk',
      conclusion: 'momentum accepted; risk remains bounded',
      level: 'thinking',
    },
  ]);

  const initialEvents = getInitialTerminalEvents(sequence);

  assert.equal(initialEvents.length, 2);
  assert.equal(initialEvents.some((event) => event.level === 'thinking'), false);
  assert.equal(initialEvents.some((event) => event.level === 'conclusion'), false);
});

test('uses a full-width strategy stream with compact top-right status', () => {
  assert.equal(indexHtml.includes('data-dashboard-updated'), false);
  assert.equal(indexHtml.includes('dashboard-status-panel'), false);
  assert.match(indexHtml, /dashboard-preview-status/);
  assert.match(indexHtml, /dashboard-terminal-panel/);
});

test('prevents clipped terminal rows from bleeding through the bottom edge', () => {
  assert.match(fs.readFileSync(path.join(__dirname, '..', 'js', 'home-dashboard.js'), 'utf8'), /MAX_TERMINAL_LINES\s*=\s*6/);
  assert.match(indexHtml, /\.dashboard-proofs\s*\{[\s\S]*position:\s*relative/);
  assert.match(indexHtml, /\.dashboard-proofs::after/);
  assert.match(indexHtml, /\.dashboard-terminal-channel\s*\{[\s\S]*white-space:\s*nowrap/);
});

test('adds a slow breathing gradient border to the dashboard shell', () => {
  assert.match(indexHtml, /\.dashboard-preview-shell::before/);
  assert.match(indexHtml, /animation:\s*dashboardBorderBreath\s+(?:8|9|10)s\s+ease-in-out\s+infinite/);
  assert.match(indexHtml, /@keyframes\s+dashboardBorderBreath/);
});

test('keeps the navigation icon set aligned with the requested menu', () => {
  assert.equal(fs.existsSync(path.join(__dirname, '..', 'img', 'logo', 'fourmeme.png')), true);
  assert.equal(fs.existsSync(path.join(__dirname, '..', 'img', 'logo', 'language.svg')), true);
  assert.equal(fs.existsSync(path.join(__dirname, '..', 'img', 'logo', 'deposit-in.svg')), false);
  assert.equal(indexHtml.includes('gmgn'), false);
  assert.equal(indexHtml.includes('GMGN'), false);
  assert.equal(indexHtml.includes('dexscreener'), false);
  assert.equal(indexHtml.includes('pump.webp'), false);
  assert.equal(indexHtml.includes('telegram'), false);
  assert.equal(indexHtml.includes('stake-button'), false);
  assert.equal(indexHtml.includes('nav.stake'), false);
  assert.match(indexHtml, /social fourmeme/);
  assert.match(indexHtml, /img\/logo\/fourmeme\.png/);
  assert.match(indexHtml, /language-toggle social/);
  assert.match(indexHtml, /deposit-button/);
  assert.match(indexHtml, /data-i18n="nav.deposit"/);
  assert.equal(indexHtml.includes('deposit-button-icon'), false);
  assert.match(indexHtml, /<div class="deposit-button deposit-button-primary"><span data-i18n="nav.deposit">DEPOSIT<\/span><\/div>/);
  assert.match(indexHtml, /<div class="deposit-button"><span data-i18n="nav.deposit">DEPOSIT<\/span><\/div>/);
  assert.match(indexHtml, /\.deposit-button-primary\s*\{[\s\S]*border:\s*2px\s+solid\s+var\(--yellow\)/);
  assert.match(indexHtml, /\.deposit-button-primary\s*\{[\s\S]*background:\s*linear-gradient\(110deg,\s*var\(--yellow\)/);
  assert.match(indexHtml, /\.deposit-button-primary\s*\{[\s\S]*animation:\s*depositButtonGlow\s+2\.6s\s+ease-in-out\s+infinite/);
  assert.match(indexHtml, /\.deposit-button-primary::before/);
  assert.match(indexHtml, /\.deposit-button-primary::after/);
  assert.match(indexHtml, /@keyframes\s+depositButtonSheen/);
  assert.match(indexHtml, /@keyframes\s+depositButtonPulse/);
  assert.doesNotMatch(depositGlowKeyframes, /scale\(/);
  assert.doesNotMatch(depositGlowKeyframes, /translateY\(/);
  assert.match(indexHtml, /\.social\.language-toggle\s*\{[\s\S]*background-size:\s*70%/);
});

test('hides the navigation on any downward scroll and shows it while scrolling up', () => {
  assert.match(indexHtml, /var lastHeaderScrollY\s*=\s*0/);
  assert.match(indexHtml, /var headerDirectionThreshold\s*=\s*1/);
  assert.match(indexHtml, /var headerState\s*=\s*'top'/);
  assert.match(indexHtml, /function setHeaderState\(nextState\)/);
  assert.match(indexHtml, /if \(headerState === nextState\)\s*\{[\s\S]*return/);
  assert.match(indexHtml, /var isAtPageTop\s*=\s*currentY\s*<=\s*4/);
  assert.match(indexHtml, /var isScrollingUp\s*=\s*currentY\s*<\s*lastHeaderScrollY\s*-\s*headerDirectionThreshold/);
  assert.match(indexHtml, /var isScrollingDown\s*=\s*currentY\s*>\s*lastHeaderScrollY\s*\+\s*headerDirectionThreshold/);
  assert.match(indexHtml, /\$headerWrapper\.removeClass\('small is-hidden'\)/);
  assert.match(indexHtml, /\$headerWrapper\.addClass\('small'\)/);
  assert.match(indexHtml, /if \(isScrollingUp\)\s*\{[\s\S]*setHeaderState\('shown'\)/);
  assert.match(indexHtml, /if \(isScrollingDown\)\s*\{[\s\S]*setHeaderState\('hidden'\)/);
  assert.match(indexHtml, /transform:\s*'translate\(-50%, -120%\)'/);
  assert.match(indexHtml, /lastHeaderScrollY\s*=\s*currentY/);
  assert.match(indexHtml, /\.header-fixed-wrapper\.small\.is-hidden\s*\{[\s\S]*transform:\s*translate\(-50%,\s*-120%\)/);
});

test('keeps hero runtime effects bounded to the visible first viewport', () => {
  assert.match(indexHtml, /var heroEffectsPaused\s*=\s*false/);
  assert.match(indexHtml, /function setHeroEffectsPaused\(shouldPause\)/);
  assert.match(indexHtml, /if \(heroEffectsPaused === shouldPause\)\s*\{[\s\S]*return/);
  assert.match(indexHtml, /\$scene\.toggleClass\('hero-effects-paused',\s*shouldPause\)/);
  assert.match(indexHtml, /setHeroEffectsPaused\(currentY > \$\(window\)\.height\(\)\)/);
  assert.match(indexHtml, /\.scene\.hero-effects-paused::before,\s*[\s\S]*\.scene\.hero-effects-paused::after,\s*[\s\S]*\.scene\.hero-effects-paused \.bcs img,\s*[\s\S]*\.scene\.hero-effects-paused \.hero-signal-track\s*\{[\s\S]*animation-play-state:\s*paused/);
  assert.equal(indexHtml.includes('var FormImages = new Images'), false);
  assert.equal(indexHtml.includes('FormImages.load()'), false);
  assert.match(indexHtml, /step:\s*100\s*\/\s*\(\(140\s*\+\s*1\)\s*\+\s*\(60\s*\+\s*1\)\s*\+\s*\(60\s*\+\s*1\)\)/);
});

test('adds the project logo before the large letter row', () => {
  assert.equal(fs.existsSync(path.join(__dirname, '..', 'img', 'fav.png')), true);
  assert.match(indexHtml, /\.numbers-logo\s*\{[\s\S]*background-image:\s*url\('img\/fav\.png'\)/);
  assert.match(indexHtml, /<div class="numbers-container">\s*<div class="numbers-logo" data-scroll data-scroll-direction="horizontal" data-scroll-speed="25" aria-label="MEMEchelin logo"><\/div>\s*<div class="number"/);
});

test('adds an API-ready staking summary strip before project introduction', () => {
  assert.match(indexHtml, /<script src="js\/staking-summary\.js" type="text\/javascript"><\/script>/);
  assert.match(indexHtml, /<section id="staking-summary" class="staking-summary" data-scroll-section data-staking-summary data-staking-endpoint="">/);
  assert.match(indexHtml, /data-i18n="staking\.total\.label">Total Staked/);
  assert.match(indexHtml, /data-i18n="staking\.apy\.label">APY Yield/);
  assert.match(indexHtml, /data-staking-total data-staking-fallback="12800000">\$12,800,000/);
  assert.match(indexHtml, /data-staking-apy data-staking-fallback="18\.6">18\.6%/);
  assert.match(indexHtml, /<div class="deposit-button deposit-button-primary staking-summary-action"><span data-i18n="nav.deposit">DEPOSIT<\/span><\/div>/);
  assert.match(indexHtml, /<section id="staking-summary"[\s\S]*<section id="who"/);
  assert.match(indexHtml, /\.staking-summary-shell\s*\{[\s\S]*grid-template-columns:\s*1fr\s+1fr\s+auto/);
  assert.match(indexHtml, /\.staking-summary-digit\.is-jumping\s*\{[\s\S]*animation:\s*stakingDigitJump\s+0\.56s/);
  assert.match(indexHtml, /animation-delay:\s*calc\(var\(--digit-index\)\s*\*\s*28ms\)/);
  assert.match(indexHtml, /@keyframes\s+stakingDigitJump/);
});

test('formats and applies staking summary API payloads', () => {
  assert.equal(formatFullUsd(12800000), '$12,800,000');
  assert.equal(formatApy(18.64), '18.6%');
  assert.doesNotMatch(fs.readFileSync(path.join(__dirname, '..', 'js', 'staking-summary.js'), 'utf8'), /TOTAL_VARIATION/);

  const previousDocument = global.document;
  global.document = {
    createElement: function() {
      return {
        className: '',
        textContent: '',
        style: {
          setProperty: function() {},
        },
      };
    },
  };
  const totalNode = {
    children: [],
    textContent: '',
    appendChild: function(child) {
      this.children.push(child);
      this.textContent += child.textContent;
      return child;
    },
    getAttribute: function() { return null; },
  };
  const apyNode = { textContent: '', getAttribute: function() { return null; } };
  const rootNode = {
    querySelector: function(selector) {
      if (selector === '[data-staking-total]') return totalNode;
      if (selector === '[data-staking-apy]') return apyNode;
      return null;
    },
  };
  const state = { total: 12800000, apy: 18.6 };

  try {
    applyPayload(rootNode, state, { totalStaked: 15450000, apy: 21.25 });
  } finally {
    global.document = previousDocument;
  }

  assert.equal(totalNode.textContent, '$15,450,000');
  assert.ok(totalNode.children.some((child) => child.className === 'staking-summary-digit'));
  assert.equal(apyNode.textContent, '21.3%');
  assert.equal(state.total, 15450000);
});

test('removes the hero community and project buy buttons', () => {
  assert.equal(indexHtml.includes('button-join'), false);
  assert.equal(indexHtml.includes('who-button'), false);
  assert.equal(indexHtml.includes('common.join'), false);
  assert.equal(indexHtml.includes('who.cta'), false);
  assert.equal(indexHtml.includes('text-and-button-desktop'), false);
  assert.equal(indexHtml.includes('text-left-right'), false);
});

test('uses a bottom hero marquee with the merged signal message', () => {
  assert.match(indexHtml, /hero-signal-marquee hidden/);
  assert.match(indexHtml, /hero-signal-track/);
  assert.match(indexHtml, /\.hero-signal-marquee\s*\{[\s\S]*width:\s*100vw/);
  assert.match(indexHtml, /\.hero-signal-marquee\s*\{[\s\S]*transform:\s*translate\(-50%,\s*0\)/);
  assert.match(indexHtml, /data-i18n="hero\.marquee"/);
  assert.match(indexHtml, /<span class="hero-signal-stars"><span>⭐️<\/span><span>⭐️<\/span><span>⭐️<\/span><\/span>/);
  assert.match(indexHtml, /🚀/);
  assert.match(indexHtml, /🛰️/);
  assert.match(indexHtml, /@keyframes\s+heroSignalMarquee/);
  assert.match(indexHtml, /animation:\s*heroSignalMarquee\s+26s\s+linear\s+infinite/);
  assert.match(indexHtml, /\$\(\'\.hero-signal-marquee\'\)\.removeClass\('hidden'\)/);
  assert.equal(indexHtml.includes('data-i18n="hero.left"'), false);
  assert.equal(indexHtml.includes('data-i18n="hero.right"'), false);
});

test('adds an intermittent signal fault overlay to the hero art group', () => {
  assert.match(indexHtml, /\.scene::before,\s*[\s\S]*\.scene::after\s*\{[\s\S]*width:\s*100vw/);
  assert.match(indexHtml, /\.scene::before,\s*[\s\S]*\.scene::after\s*\{[\s\S]*height:\s*100vh/);
  assert.match(indexHtml, /\.scene::before\s*\{[\s\S]*animation:\s*heroSignalFault\s+8\.8s\s+steps\(1,\s*end\)\s+infinite/);
  assert.match(indexHtml, /\.scene::after\s*\{[\s\S]*clip-path:\s*polygon/);
  assert.match(indexHtml, /\.scene::after\s*\{[\s\S]*animation:\s*heroSignalFaultSlices\s+8\.8s\s+steps\(1,\s*end\)\s+infinite/);
  assert.match(indexHtml, /\.bcs img\s*\{[\s\S]*animation:\s*heroSignalImageFault\s+8\.8s\s+steps\(1,\s*end\)\s+infinite/);
  assert.match(indexHtml, /@keyframes\s+heroSignalFault/);
  assert.match(indexHtml, /@keyframes\s+heroSignalFaultSlices/);
  assert.match(indexHtml, /@keyframes\s+heroSignalImageFault/);
  assert.match(indexHtml, /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*\.scene::before,\s*[\s\S]*\.scene::after,\s*[\s\S]*\.bcs img,\s*[\s\S]*\.hero-signal-track\s*\{[\s\S]*animation:\s*none/);
});

test('keeps the project introduction visible without scroll callback dependency', () => {
  assert.match(whoSectionHtml, /<div class="title text-gradient animated-letters" data-i18n="who\.title"/);
  assert.match(whoSectionHtml, /<div class="animated-blocks">/);
  assert.match(whoSectionHtml, /<div class="who-left"><img src="files\/anim\/bibendum-2\/0000\.webp"><\/div>/);
  assert.match(whoSectionHtml, /<div class="who-right"><img src="files\/anim\/bibendum-3\/0000\.webp"><\/div>/);
  assert.doesNotMatch(whoSectionHtml, /class="title text-gradient animated-letters hidden"/);
  assert.doesNotMatch(whoSectionHtml, /class="animated-blocks hidden"/);
  assert.doesNotMatch(whoSectionHtml, /class="who-left hidden"/);
  assert.doesNotMatch(whoSectionHtml, /class="who-right hidden"/);
});

test('keeps the project intro stars on one row', () => {
  assert.match(indexHtml, /\.who-number-number\s*\{[\s\S]*display:\s*flex/);
  assert.match(indexHtml, /\.who-number-number\s*\{[\s\S]*white-space:\s*nowrap/);
  assert.match(indexHtml, /\.who-number-text\s*\{[\s\S]*margin-top:\s*22px/);
  assert.match(whoSectionHtml, /<div class="who-number-number"><span>⭐️<\/span><span>⭐️<\/span><span>⭐️<\/span><\/div>/);
});

test('animates project intro stars with staggered looping motion', () => {
  assert.match(indexHtml, /\.who-number-number span\s*\{[\s\S]*animation:\s*whoStarPulse\s+2\.8s\s+ease-in-out\s+infinite/);
  assert.match(indexHtml, /\.who-number-number span:nth-child\(2\)\s*\{[\s\S]*animation-delay:\s*0\.3s/);
  assert.match(indexHtml, /\.who-number-number span:nth-child\(3\)\s*\{[\s\S]*animation-delay:\s*0\.6s/);
  assert.match(indexHtml, /@keyframes\s+whoStarPulse/);
});
