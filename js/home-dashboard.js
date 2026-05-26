(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.HomeDashboard = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
    var MAX_TERMINAL_LINES = 6;
    var STREAM_INTERVAL = 1450;
    var THINKING_INTERVAL = 3200;
    var CONCLUSION_INTERVAL = 1200;
    var IDLE_PAUSE_INTERVAL = 2400;
    var TYPEWRITER_INTERVAL = 28;

    var CHANNEL_ICONS = {
        'AGENT': '◆',
        'AI': '✦',
        'BNB-SCAN': '◉',
        'EXEC': '▶',
        'LIQUID': '≈',
        'RISK': '!',
        'SIGNAL': '◇',
        'SOCIAL': '#',
        'TREASURY': '▣',
        'TX': '⛓',
        'WALLET': '◌',
    };

    var MOTION_GLYPHS = {
        'AGENT': '...',
        'AI': '↻',
        'BNB-SCAN': '∙∙∙',
        'EXEC': '▸',
        'LIQUID': '≈≈',
        'RISK': '×',
        'SIGNAL': '»',
        'SOCIAL': '++',
        'TREASURY': '▣',
        'TX': '↝',
        'WALLET': '◇',
    };

    var SIMULATED_DASHBOARD = {
        stats: [
            { label: 'Signal Streams', value: '7x24', change: 'BNB scan' },
            { label: 'Risk Filters', value: '4', change: 'Active layers' },
            { label: 'Execution Mode', value: 'Auto', change: 'Discipline' },
            { label: 'Flywheel', value: 'Loop', change: 'Treasury' },
        ],
        status: {
            label: 'Engine Loop',
            value: 'AI',
            detail: 'Sense, decide, execute, recycle',
        },
        terminalEvents: [
            { channel: 'BNB-SCAN', message: 'new meme pair detected', detail: 'liquidity delta sampled', level: 'scan' },
            { channel: 'TX', message: 'swap intent observed', detail: 'routing into BNB meme pool', level: 'signal', walletActor: '0x8b71...A421' },
            { channel: 'AGENT', message: 'thinking...', detail: 'weighing momentum against liquidity risk', conclusion: 'momentum score 78; risk rating stable', level: 'thinking' },
            { channel: 'SOCIAL', message: 'meme velocity rising', detail: 'noise cluster normalized', level: 'pulse' },
            { channel: 'WALLET', message: 'smart-flow cluster scored', detail: 'confidence 0.82', level: 'score', pauseAfter: true },
            { channel: 'TX', message: 'liquidity add detected', detail: 'LP depth moved above watch floor', level: 'scan', walletActor: '0x5fA2...D317' },
            { channel: 'RISK', message: 'honeypot pattern rejected', detail: 'execution gate closed', level: 'risk' },
            { channel: 'AGENT', message: 'thinking...', detail: 'scoring wallet flow and liquidity depth', conclusion: 'signal score 82; risk rating controlled', level: 'thinking' },
            { channel: 'LIQUID', message: 'LP shift tracked', detail: 'slippage window stable', level: 'scan' },
            { channel: 'AI', message: 'momentum vector updated', detail: 'alpha queue reprioritized', level: 'score' },
            { channel: 'TX', message: 'buy pressure clustered', detail: 'signal confidence raised', level: 'signal', walletActor: '0x2b67...20bE' },
            { channel: 'SIGNAL', message: 'candidate routed to output', detail: 'discipline rules passed', level: 'signal', pauseAfter: true },
            { channel: 'TREASURY', message: 'flywheel state synced', detail: 'recycle loop standing by', level: 'pulse' },
            { channel: 'AGENT', message: 'thinking...', detail: 'rating second confirmation tick', conclusion: 'liquidity score 74; output rating upgraded', level: 'thinking' },
            { channel: 'EXEC', message: 'auto mode simulation active', detail: 'no live order submitted', level: 'signal' },
        ],
    };

    function getSimulatedDashboardData() {
        return {
            stats: SIMULATED_DASHBOARD.stats.slice(),
            status: {
                label: SIMULATED_DASHBOARD.status.label,
                value: SIMULATED_DASHBOARD.status.value,
                detail: SIMULATED_DASHBOARD.status.detail,
            },
            terminalEvents: SIMULATED_DASHBOARD.terminalEvents.slice(),
        };
    }

    function createTerminalLine(event, index) {
        event = event && typeof event === 'object' ? event : {};
        var actor = toText(event.walletActor) || formatWalletAddress(event.wallet);
        var message = toText(event.message) || 'signal loop heartbeat';

        return {
            id: 'signal-' + index,
            time: formatTerminalTime(new Date()),
            channel: toText(event.channel) || 'SYSTEM',
            icon: getTerminalIcon(event.channel, event.level),
            motion: getMotionGlyph(event.channel, event.level),
            actor: actor,
            message: actor ? actor + ' ' + message : message,
            detail: toText(event.detail) || 'simulation active',
            level: toText(event.level) || 'pulse',
            pauseAfter: event.pauseAfter === true,
            typewriter: toText(event.channel) === 'AGENT',
        };
    }

    function getTerminalIcon(channel, level) {
        channel = toText(channel);

        if (CHANNEL_ICONS[channel]) {
            return CHANNEL_ICONS[channel];
        }

        if (level === 'conclusion') {
            return '✓';
        }

        return '•';
    }

    function getMotionGlyph(channel, level) {
        channel = toText(channel);

        if (level === 'conclusion') {
            return '✓';
        }

        if (MOTION_GLYPHS[channel]) {
            return MOTION_GLYPHS[channel];
        }

        return '·';
    }

    function getTerminalEventSequence(events) {
        var sequence = [];

        events.forEach(function(event) {
            sequence.push(event);

            if (event && event.level === 'thinking' && event.conclusion) {
                sequence.push({
                    channel: event.channel || 'AGENT',
                    message: event.conclusion,
                    detail: 'analysis checkpoint complete',
                    level: 'conclusion',
                });
            }
        });

        return sequence;
    }

    function getTerminalDelay(event) {
        if (event && event.level === 'thinking') {
            return Math.max(THINKING_INTERVAL, estimateTypewriterDuration(event) + 1300);
        }

        if (event && event.level === 'conclusion') {
            return Math.max(CONCLUSION_INTERVAL, estimateTypewriterDuration(event) + 700);
        }

        if (event && event.pauseAfter) {
            return IDLE_PAUSE_INTERVAL;
        }

        return STREAM_INTERVAL;
    }

    function estimateTypewriterDuration(event) {
        var length = toText(event && event.message).length + toText(event && event.detail).length;

        return length * TYPEWRITER_INTERVAL;
    }

    function getInitialTerminalEvents(sequence) {
        var initialEvents = [];

        for (var i = 0; i < sequence.length && initialEvents.length < 6; i += 1) {
            if (sequence[i] && (sequence[i].level === 'thinking' || sequence[i].level === 'conclusion')) {
                break;
            }

            initialEvents.push(sequence[i]);
        }

        return initialEvents;
    }

    function initDashboardPreview(doc) {
        doc = doc || document;

        var section = doc.querySelector('[data-dashboard-preview]');
        if (!section) {
            return;
        }

        var data = getSimulatedDashboardData();

        renderStats(section, data.stats);
        renderStatus(section, data.status);
        startTerminalStream(section, data.terminalEvents);

        section.classList.add('dashboard-preview-loaded');
    }

    function renderStats(section, stats) {
        var container = section.querySelector('[data-dashboard-stats]');
        if (!container) {
            return;
        }

        container.innerHTML = '';
        stats.forEach(function(stat) {
            var card = document.createElement('div');
            card.className = 'dashboard-stat';

            var label = document.createElement('div');
            label.className = 'dashboard-stat-label';
            setDynamicKey(label, stat.label);
            label.textContent = getDynamicText(stat.label);

            var value = document.createElement('div');
            value.className = 'dashboard-stat-value';
            setDynamicKey(value, stat.value);
            value.textContent = getDynamicText(stat.value);

            var change = document.createElement('div');
            change.className = 'dashboard-stat-change';
            setDynamicKey(change, stat.change);
            change.textContent = getDynamicText(stat.change);

            card.appendChild(label);
            card.appendChild(value);
            card.appendChild(change);
            container.appendChild(card);
        });
    }

    function renderStatus(section, status) {
        setText(section, '[data-dashboard-status-label]', getDynamicText(status.label));
        setDynamicKey(section.querySelector('[data-dashboard-status-label]'), status.label);
        setText(section, '[data-dashboard-status-value]', getDynamicText(status.value));
        setDynamicKey(section.querySelector('[data-dashboard-status-value]'), status.value);
        setText(section, '[data-dashboard-status-detail]', getDynamicText(status.detail));
        setDynamicKey(section.querySelector('[data-dashboard-status-detail]'), status.detail);
    }

    function startTerminalStream(section, events) {
        var container = section.querySelector('[data-dashboard-terminal]');
        if (!container || !events.length) {
            return;
        }

        var sequence = getTerminalEventSequence(events);
        var initialEvents = getInitialTerminalEvents(sequence);
        var cursor = 0;

        container.innerHTML = '';
        for (var i = 0; i < initialEvents.length; i += 1) {
            appendTerminalLine(container, createTerminalLine(initialEvents[i], cursor));
            cursor += 1;
        }

        if (typeof window !== 'undefined' && window.setTimeout) {
            var tick = function() {
                var event = sequence[cursor % sequence.length];
                appendTerminalLine(container, createTerminalLine(event, cursor));
                cursor += 1;

                window.setTimeout(tick, getTerminalDelay(event));
            };

            window.setTimeout(tick, getTerminalDelay(sequence[(cursor - 1 + sequence.length) % sequence.length]));
        }
    }

    function appendTerminalLine(container, line) {
        var row = document.createElement('div');
        row.className = 'dashboard-terminal-line dashboard-terminal-line-' + line.level;

        var time = document.createElement('span');
        time.className = 'dashboard-terminal-time';
        time.textContent = line.time;

        var channel = document.createElement('span');
        channel.className = 'dashboard-terminal-channel';
        var icon = document.createElement('span');
        icon.className = 'dashboard-terminal-icon';
        icon.textContent = line.icon;

        var channelText = document.createElement('span');
        channelText.textContent = '[' + line.channel + ']';

        var motion = document.createElement('span');
        motion.className = 'dashboard-terminal-motion';
        motion.textContent = line.motion;

        channel.appendChild(icon);
        channel.appendChild(channelText);
        channel.appendChild(motion);

        var message = document.createElement('span');
        message.className = 'dashboard-terminal-message';
        if (!line.typewriter) {
            message.textContent = line.message;
        }

        var detail = document.createElement('span');
        detail.className = 'dashboard-terminal-detail';
        if (!line.typewriter) {
            detail.textContent = line.detail;
        }

        row.appendChild(time);
        row.appendChild(channel);
        row.appendChild(message);
        row.appendChild(detail);
        container.appendChild(row);

        while (container.children.length > MAX_TERMINAL_LINES) {
            container.removeChild(container.firstElementChild);
        }

        if (line.typewriter) {
            typeText(message, line.message, function() {
                typeText(detail, line.detail);
            });
        }
    }

    function setDynamicKey(node, value) {
        if (node && value) {
            node.setAttribute('data-i18n', 'dashboard.dynamic.' + value);
        }
    }

    function getDynamicText(value) {
        var key = 'dashboard.dynamic.' + value;

        if (typeof window === 'undefined' || !window.MEMEchelinI18n) {
            return value;
        }

        var language = document.documentElement.getAttribute('lang') === 'zh-CN' ? 'zh' : 'en';
        var copy = window.MEMEchelinI18n.getTranslations(language);

        return copy[key] || value;
    }

    function setText(section, selector, value) {
        var node = section.querySelector(selector);
        if (node) {
            node.textContent = value;
        }
    }

    function formatTerminalTime(date) {
        return [
            pad(date.getHours()),
            pad(date.getMinutes()),
            pad(date.getSeconds()),
        ].join(':');
    }

    function pad(value) {
        return String(value).padStart(2, '0');
    }

    function formatWalletAddress(value) {
        value = toText(value);

        if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
            return '';
        }

        return value.slice(0, 6) + '...' + value.slice(-4);
    }

    function toText(value) {
        return value === undefined || value === null ? '' : String(value);
    }

    function typeText(node, text, done) {
        var index = 0;
        text = toText(text);

        if (typeof window === 'undefined' || !window.setTimeout) {
            node.textContent = text;
            if (done) {
                done();
            }
            return;
        }

        node.textContent = '';

        var tick = function() {
            node.textContent = text.slice(0, index);
            index += 1;

            if (index <= text.length) {
                window.setTimeout(tick, TYPEWRITER_INTERVAL);
            } else if (done) {
                done();
            }
        };

        tick();
    }

    if (typeof document !== 'undefined') {
        document.addEventListener('DOMContentLoaded', function() {
            initDashboardPreview(document);
        });
    }

    return {
        createTerminalLine: createTerminalLine,
        formatWalletAddress: formatWalletAddress,
        getInitialTerminalEvents: getInitialTerminalEvents,
        getSimulatedDashboardData: getSimulatedDashboardData,
        getTerminalDelay: getTerminalDelay,
        getTerminalEventSequence: getTerminalEventSequence,
        getTerminalIcon: getTerminalIcon,
        getMotionGlyph: getMotionGlyph,
        initDashboardPreview: initDashboardPreview,
    };
});
