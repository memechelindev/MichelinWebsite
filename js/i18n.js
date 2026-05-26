(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.MEMEchelinI18n = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
    var DEFAULT_LANGUAGE = 'en';
    var STORAGE_KEY = 'memechelin-language';

    var translations = {
        en: {
            'language.toggle': 'CN',
            'hero.marquee': 'AI reads Meme noise, captures market signals early, and runs on BNB for signal, speed, and execution.',
            'nav.deposit': 'DEPOSIT',
            'dashboard.kicker': 'Live Preview',
            'dashboard.title': 'MEMEchelin Dashboard',
            'dashboard.copy': 'A preview of the AI Meme signal engine: sensing market noise, scoring momentum, tracking execution, and feeding the capital flywheel.',
            'dashboard.loading': 'Loading',
            'dashboard.signals': 'Strategy Running',
            'dashboard.message.loading': 'Loading preview data...',
            'dashboard.message.loaded': 'Preview data loaded.',
            'dashboard.message.failed': 'Preview data is temporarily unavailable.',
            'dashboard.status': 'Dashboard Status',
            'dashboard.status.waiting': 'Waiting for preview data',
            'dashboard.dynamic.Signal Streams': 'Signal Streams',
            'dashboard.dynamic.BNB scan': 'BNB scan',
            'dashboard.dynamic.Risk Filters': 'Risk Filters',
            'dashboard.dynamic.Active layers': 'Active layers',
            'dashboard.dynamic.Execution Mode': 'Execution Mode',
            'dashboard.dynamic.Auto': 'Auto',
            'dashboard.dynamic.Discipline': 'Discipline',
            'dashboard.dynamic.Flywheel': 'Flywheel',
            'dashboard.dynamic.Loop': 'Loop',
            'dashboard.dynamic.Treasury': 'Treasury',
            'dashboard.dynamic.New Meme Scan': 'New Meme Scan',
            'dashboard.dynamic.BNB flow': 'BNB flow',
            'dashboard.dynamic.Sensed': 'Sensed',
            'dashboard.dynamic.Liquidity Shift': 'Liquidity Shift',
            'dashboard.dynamic.LP delta': 'LP delta',
            'dashboard.dynamic.Scored': 'Scored',
            'dashboard.dynamic.Wallet Behavior': 'Wallet Behavior',
            'dashboard.dynamic.Smart flow': 'Smart flow',
            'dashboard.dynamic.Filtered': 'Filtered',
            'dashboard.dynamic.Signal Output': 'Signal Output',
            'dashboard.dynamic.Alpha queue': 'Alpha queue',
            'dashboard.dynamic.Ready': 'Ready',
            'dashboard.dynamic.Engine Loop': 'Engine Loop',
            'dashboard.dynamic.Sense, decide, execute, recycle': 'Sense, decide, execute, recycle',
            'staking.total.label': 'Total Staked',
            'staking.apy.label': 'APY Yield',
            'staking.modal.title': 'Stake & Earn',
            'staking.tvl.label': 'Total Value Locked',
            'staking.yourStake.label': 'Your Stake',
            'staking.pending.label': 'Pending Reward',
            'staking.tab.deposit': 'Deposit',
            'staking.tab.withdraw': 'Withdraw',
            'staking.deposit.btn': 'Deposit',
            'staking.withdraw.btn': 'Withdraw',
            'staking.max': 'MAX',
            'staking.balance': 'Balance:',
            'staking.withdraw.balance': 'Staked:',
            'staking.hint': 'Connect wallet to stake',
            'who.title': '<span>W</span><span>H</span><span>O</span>&nbsp;<span>W</span><span>E</span>&nbsp;<span>A</span><span>R</span><span>E</span>',
            'who.body': 'MEMEchelin is an AI-driven Meme trading engine built on BNB Chain.<br>It turns chaotic on-chain activity, liquidity shifts, wallet behavior, and social momentum into structured signals for faster decisions.',
            'who.badge': 'TOP-TIER VIBES <br>DEGEN-TRUSTED',
            'who.strong': 'We do not chase noise for its own sake.<br>MEMEchelin is designed around a closed loop: data sensing, AI decisioning, signal output, automated execution, and treasury-driven value capture.',
            'ribbon.1': '🏍️ From Meme Noise To Machine Signals 💥 • 🏍️ From Meme Noise To Machine Signals 💥 • 🏍️ From Meme Noise To Machine Signals 💥 • 🏍️ From Meme Noise To Machine Signals 💥 • 🏍️ From Meme Noise To Machine Signals 💥',
            'ribbon.2': '✈️ 7x24 BNB Chain Market Sensing 🛩️ • ✈️ 7x24 BNB Chain Market Sensing 🛩️ • ✈️ 7x24 BNB Chain Market Sensing 🛩️ • ✈️ 7x24 BNB Chain Market Sensing 🛩️ • ✈️ 7x24 BNB Chain Market Sensing 🛩️',
            'ribbon.3': '🚅 AI Scores Momentum, Risk And Flow 🚄 • 🚅 AI Scores Momentum, Risk And Flow 🚄 • 🚅 AI Scores Momentum, Risk And Flow 🚄 • 🚅 AI Scores Momentum, Risk And Flow 🚄',
            'ribbon.4': '🛸 Data In, Signal Out ✨ • 🛸 Data In, Signal Out ✨ • 🛸 Data In, Signal Out ✨ • 🛸 Data In, Signal Out ✨ • 🛸 Data In, Signal Out ✨',
            'ribbon.5': '🛞 MEMEchelin - AI Driven Meme Execution • 🛞 MEMEchelin - AI Driven Meme Execution • 🛞 MEMEchelin - AI Driven Meme Execution • 🛞 MEMEchelin - AI Driven Meme Execution',
            'ribbon.6': '🛰️ Scan, Decide, Execute, Recycle 💫 • 🛰️ Scan, Decide, Execute, Recycle 💫 • 🛰️ Scan, Decide, Execute, Recycle 💫 • 🛰️ Scan, Decide, Execute, Recycle 💫',
            'ribbon.7': '🚚 $MEMEchelin - Built For The Capital Flywheel 🚛 • 🚚 $MEMEchelin - Built For The Capital Flywheel 🚛 • 🚚 $MEMEchelin - Built For The Capital Flywheel 🚛',
            'ribbon.8': '🏎️ Remove Emotion, Keep Discipline ⚡️ • 🏎️ Remove Emotion, Keep Discipline ⚡️ • 🏎️ Remove Emotion, Keep Discipline ⚡️ • 🏎️ Remove Emotion, Keep Discipline ⚡️',
            'ribbon.9': '🚀 AI Reads Meme, System Creates Alpha 🌔 • 🚀 AI Reads Meme, System Creates Alpha 🌔 • 🚀 AI Reads Meme, System Creates Alpha 🌔',
            'faq.title': '<span>F</span><span>A</span><span>Q</span>',
            'faq.q1': 'What is this project?',
            'faq.a1': 'MEMEchelin is an AI Meme trading engine on BNB Chain. It is designed to transform on-chain activity, liquidity movement, wallet behavior, and social momentum into structured market signals.',
            'faq.q2': 'How do I buy MEMEchelin tokens?',
            'faq.a2': 'Use the official community links above for current contract and trading information. Always verify the address before interacting with any token or market.',
            'faq.q3': 'What makes MEMEchelin different?',
            'faq.a3': 'MEMEchelin focuses on an automated loop: data sensing, AI decisioning, signal output, execution discipline, and treasury-driven value capture. The goal is to make Meme market participation more systematic.',
            'faq.q4': 'How does the capital flywheel work?',
            'faq.a4': '• Strategy revenue and liquidity returns can flow into the protocol treasury.<br>• Treasury actions can support buyback, burn, and next-round strategy capital.<br>• Higher system activity creates more data for model iteration and risk filtering.<br>This is a mechanism design direction, not a guaranteed return promise.',
            'faq.q5': 'Where can I get the latest updates?',
            'faq.a5': 'Follow our X @MEMEchelin and community channels for official updates, dashboard releases, and signal engine progress.',
        },
        zh: {
            'language.toggle': 'EN',
            'hero.marquee': 'AI 读取 Meme 噪音，抢先捕捉市场信号，基于 BNB 为信号、速度与执行而生。',
            'nav.deposit': 'DEPOSIT',
            'dashboard.kicker': '实时预览',
            'dashboard.title': 'MEMEchelin 数据看板',
            'dashboard.copy': '预览 AI Meme 信号引擎：感知市场噪音、评估动量、追踪执行，并接入资本飞轮。',
            'dashboard.loading': '加载中',
            'dashboard.signals': '策略运行中',
            'dashboard.message.loading': '正在加载预览数据...',
            'dashboard.message.loaded': '预览数据已加载。',
            'dashboard.message.failed': '预览数据暂时不可用。',
            'dashboard.status': '看板状态',
            'dashboard.status.waiting': '等待预览数据',
            'dashboard.dynamic.Signal Streams': '信号流',
            'dashboard.dynamic.BNB scan': 'BNB 扫描',
            'dashboard.dynamic.Risk Filters': '风险过滤',
            'dashboard.dynamic.Active layers': '活跃层级',
            'dashboard.dynamic.Execution Mode': '执行模式',
            'dashboard.dynamic.Auto': '自动',
            'dashboard.dynamic.Discipline': '纪律执行',
            'dashboard.dynamic.Flywheel': '飞轮',
            'dashboard.dynamic.Loop': '闭环',
            'dashboard.dynamic.Treasury': '金库',
            'dashboard.dynamic.New Meme Scan': '新 Meme 扫描',
            'dashboard.dynamic.BNB flow': 'BNB 流量',
            'dashboard.dynamic.Sensed': '已感知',
            'dashboard.dynamic.Liquidity Shift': '流动性异动',
            'dashboard.dynamic.LP delta': 'LP 变化',
            'dashboard.dynamic.Scored': '已评分',
            'dashboard.dynamic.Wallet Behavior': '钱包行为',
            'dashboard.dynamic.Smart flow': '聪明钱流向',
            'dashboard.dynamic.Filtered': '已过滤',
            'dashboard.dynamic.Signal Output': '信号输出',
            'dashboard.dynamic.Alpha queue': 'Alpha 队列',
            'dashboard.dynamic.Ready': '就绪',
            'dashboard.dynamic.Engine Loop': '引擎闭环',
            'dashboard.dynamic.Sense, decide, execute, recycle': '感知、决策、执行、再循环',
            'staking.total.label': '总质押金额',
            'staking.apy.label': 'APY 收益',
            'staking.modal.title': '质押赚取',
            'staking.tvl.label': '总锁仓量',
            'staking.yourStake.label': '我的质押',
            'staking.pending.label': '待领取奖励',
            'staking.tab.deposit': '存入',
            'staking.tab.withdraw': '提取',
            'staking.deposit.btn': '存入',
            'staking.withdraw.btn': '提取',
            'staking.max': '最大',
            'staking.balance': '余额:',
            'staking.withdraw.balance': '已质押:',
            'staking.hint': '连接钱包以开始质押',
            'who.title': '<span>项</span><span>目</span>&nbsp;<span>介</span><span>绍</span>',
            'who.body': 'MEMEchelin 是一个基于 BNB Chain 的 AI Meme 交易引擎。<br>它将链上动态、流动性变化、钱包行为与社交传播转化为结构化信号，帮助更快完成判断。',
            'who.badge': 'AI SIGNAL ENGINE <br>BNB MEME LOOP',
            'who.strong': '我们不追逐噪音本身。<br>MEMEchelin 围绕闭环构建：数据感知、AI 决策、信号产出、自动执行与金库价值捕获。',
            'ribbon.1': '🏍️ 从 Meme 噪音到机器信号 💥 • 🏍️ 从 Meme 噪音到机器信号 💥 • 🏍️ 从 Meme 噪音到机器信号 💥 • 🏍️ 从 Meme 噪音到机器信号 💥',
            'ribbon.2': '✈️ 7x24 扫描 BNB Chain 市场 🛩️ • ✈️ 7x24 扫描 BNB Chain 市场 🛩️ • ✈️ 7x24 扫描 BNB Chain 市场 🛩️',
            'ribbon.3': '🚅 AI 评估动量、风险与资金流 🚄 • 🚅 AI 评估动量、风险与资金流 🚄 • 🚅 AI 评估动量、风险与资金流 🚄',
            'ribbon.4': '🛸 数据进入，信号输出 ✨ • 🛸 数据进入，信号输出 ✨ • 🛸 数据进入，信号输出 ✨ • 🛸 数据进入，信号输出 ✨',
            'ribbon.5': '🛞 MEMEchelin - AI 驱动的 Meme 执行系统 • 🛞 MEMEchelin - AI 驱动的 Meme 执行系统 • 🛞 MEMEchelin - AI 驱动的 Meme 执行系统',
            'ribbon.6': '🛰️ 扫描、决策、执行、再循环 💫 • 🛰️ 扫描、决策、执行、再循环 💫 • 🛰️ 扫描、决策、执行、再循环 💫',
            'ribbon.7': '🚚 $MEMEchelin - 为资本飞轮而生 🚛 • 🚚 $MEMEchelin - 为资本飞轮而生 🚛 • 🚚 $MEMEchelin - 为资本飞轮而生 🚛',
            'ribbon.8': '🏎️ 排除情绪，保留纪律 ⚡️ • 🏎️ 排除情绪，保留纪律 ⚡️ • 🏎️ 排除情绪，保留纪律 ⚡️',
            'ribbon.9': '🚀 AI 读懂 Meme，系统创造 Alpha 🌔 • 🚀 AI 读懂 Meme，系统创造 Alpha 🌔 • 🚀 AI 读懂 Meme，系统创造 Alpha 🌔',
            'faq.title': '<span>问</span><span>答</span>',
            'faq.q1': '这是什么项目？',
            'faq.a1': 'MEMEchelin 是 BNB Chain 上的 AI Meme 交易引擎，目标是把链上动态、流动性变化、钱包行为和社交传播转化为结构化市场信号。',
            'faq.q2': '如何购买 MEMEchelin 代币？',
            'faq.a2': '请通过官方社区链接获取当前合约与交易信息。与任何代币或市场交互前，都应先核验合约地址。',
            'faq.q3': 'MEMEchelin 有什么不同？',
            'faq.a3': 'MEMEchelin 聚焦自动化闭环：数据感知、AI 决策、信号产出、执行纪律与金库价值捕获，让 Meme 市场参与更系统化。',
            'faq.q4': '资本飞轮如何运转？',
            'faq.a4': '• 策略收益与流动性收益可进入协议金库。<br>• 金库动作可支持回购、销毁与下一轮策略资金。<br>• 更高系统活跃度会为模型迭代和风险过滤提供更多数据。<br>这是机制设计方向，不构成收益承诺。',
            'faq.q5': '在哪里获取最新消息？',
            'faq.a5': '关注 X @MEMEchelin 和官方社区，获取项目更新、看板发布与信号引擎进展。',
        },
    };

    function getDefaultLanguage() {
        return DEFAULT_LANGUAGE;
    }

    function getTranslations(language) {
        return translations[language] || translations[DEFAULT_LANGUAGE];
    }

    function getSavedLanguage() {
        try {
            return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE;
        } catch (error) {
            return DEFAULT_LANGUAGE;
        }
    }

    function saveLanguage(language) {
        try {
            localStorage.setItem(STORAGE_KEY, language);
        } catch (error) {}
    }

    function applyLanguage(language, doc) {
        doc = doc || document;
        language = language === 'zh' ? 'zh' : 'en';

        var copy = getTranslations(language);

        doc.documentElement.setAttribute('lang', language === 'zh' ? 'zh-CN' : 'en');

        Array.prototype.forEach.call(doc.querySelectorAll('[data-i18n]'), function(node) {
            var key = node.getAttribute('data-i18n');
            if (copy[key] !== undefined) {
                node.innerHTML = copy[key];
            }
        });

        Array.prototype.forEach.call(doc.querySelectorAll('[data-language-toggle]'), function(node) {
            node.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
        });

        doc.dispatchEvent(new CustomEvent('memechelin:languagechange', {
            detail: { language: language },
        }));
    }

    function toggleLanguage(doc) {
        doc = doc || document;
        var current = doc.documentElement.getAttribute('lang') === 'zh-CN' ? 'zh' : 'en';
        var next = current === 'zh' ? 'en' : 'zh';

        applyLanguage(next, doc);
        saveLanguage(next);
    }

    function init(doc) {
        doc = doc || document;
        applyLanguage(getSavedLanguage(), doc);

        Array.prototype.forEach.call(doc.querySelectorAll('[data-language-toggle]'), function(node) {
            node.addEventListener('click', function(event) {
                event.stopPropagation();
                toggleLanguage(doc);
            });
        });
    }

    if (typeof document !== 'undefined') {
        document.addEventListener('DOMContentLoaded', function() {
            init(document);
        });
    }

    return {
        applyLanguage: applyLanguage,
        getDefaultLanguage: getDefaultLanguage,
        getTranslations: getTranslations,
        init: init,
        toggleLanguage: toggleLanguage,
    };
});
