(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.MEMEchelinStaking = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
    var CONTRACT_ADDRESS = '0x2f38B47aDf52026eBc27f361483a759D1100Ab52';
    var PID = 0;
    var ABI = [
        {"inputs":[],"name":"BASIS_POINTS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"SECONDS_PER_YEAR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"baseAPY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"getCurrentAPY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"getTotalDeposited","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"pid","type":"uint256"}],"name":"getPoolInfo","outputs":[{"internalType":"address","name":"stakeToken","type":"address"},{"internalType":"uint256","name":"totalDeposited","type":"uint256"},{"internalType":"uint256","name":"accRewardPerToken","type":"uint256"},{"internalType":"uint256","name":"lastUpdateTime","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"pid","type":"uint256"},{"internalType":"address","name":"userAddress","type":"address"}],"name":"getUserInvestInfo","outputs":[{"internalType":"uint256","name":"depositedAmount","type":"uint256"},{"internalType":"uint256","name":"pendingReward","type":"uint256"},{"internalType":"uint256","name":"totalEarned","type":"uint256"},{"internalType":"uint256","name":"lastClaimTime","type":"uint256"},{"internalType":"uint256","name":"roi","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"pid","type":"uint256"},{"internalType":"address","name":"userAddress","type":"address"}],"name":"getPendingReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"pid","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"pid","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"pid","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"}
    ];

    var stakingModal = null;
    var activeTab = 'deposit';
    var isLoading = false;
    var provider = null;
    var signer = null;
    var contract = null;
    var userAddress = null;
    var refreshInterval = null;

    function init() {
        if (typeof document === 'undefined') return;

        document.addEventListener('DOMContentLoaded', function() {
            createStakingModal();
            bindDepositButtons();
            setupLanguageListener();
        });
    }

    function createStakingModal() {
        if (document.getElementById('staking-modal')) return;

        var overlay = document.createElement('div');
        overlay.id = 'staking-modal';
        overlay.className = 'staking-overlay';

        var modal = document.createElement('div');
        modal.className = 'staking-modal';

        modal.innerHTML = getModalHTML();
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        stakingModal = overlay;
        bindModalEvents();
    }

    function getModalHTML() {
        return '<div class="staking-modal-inner">' +
            '<div class="staking-header">' +
                '<div class="staking-header-title">' +
                    '<div class="staking-title-icon"></div>' +
                    '<span data-i18n="staking.modal.title">Stake & Earn</span>' +
                '</div>' +
                '<button class="staking-close" aria-label="Close">&times;</button>' +
            '</div>' +
            '<div class="staking-stats">' +
                '<div class="staking-stat">' +
                    '<div class="staking-stat-label" data-i18n="staking.tvl.label">Total Value Locked</div>' +
                    '<div class="staking-stat-value" data-staking-tvl>$0</div>' +
                '</div>' +
                '<div class="staking-stat">' +
                    '<div class="staking-stat-label" data-i18n="staking.apy.label">APY Yield</div>' +
                    '<div class="staking-stat-value" data-staking-apy>0%</div>' +
                '</div>' +
                '<div class="staking-stat">' +
                    '<div class="staking-stat-label" data-i18n="staking.yourStake.label">Your Stake</div>' +
                    '<div class="staking-stat-value" data-staking-your>$0</div>' +
                '</div>' +
                '<div class="staking-stat">' +
                    '<div class="staking-stat-label" data-i18n="staking.pending.label">Pending Reward</div>' +
                    '<div class="staking-stat-value" data-staking-pending>$0</div>' +
                '</div>' +
            '</div>' +
            '<div class="staking-tabs">' +
                '<button class="staking-tab active" data-tab="deposit" data-i18n="staking.tab.deposit">Deposit</button>' +
                '<button class="staking-tab" data-tab="withdraw" data-i18n="staking.tab.withdraw">Withdraw</button>' +
            '</div>' +
            '<div class="staking-form">' +
                '<div class="staking-form-tab active" data-form="deposit">' +
                    '<div class="staking-input-wrapper">' +
                        '<input type="number" class="staking-input" placeholder="0.0" data-staking-input-deposit />' +
                        '<button class="staking-max-btn" data-staking-max-deposit data-i18n="staking.max">MAX</button>' +
                    '</div>' +
                    '<div class="staking-balance">' +
                        '<span data-i18n="staking.balance">Balance:</span>' +
                        '<span data-staking-balance-deposit>0</span>' +
                    '</div>' +
                    '<div class="staking-submit-wrapper">' +
                        '<button class="staking-submit staking-submit-deposit" data-i18n="staking.deposit.btn">Deposit</button>' +
                    '</div>' +
                '</div>' +
                '<div class="staking-form-tab" data-form="withdraw">' +
                    '<div class="staking-input-wrapper">' +
                        '<input type="number" class="staking-input" placeholder="0.0" data-staking-input-withdraw />' +
                        '<button class="staking-max-btn" data-staking-max-withdraw data-i18n="staking.max">MAX</button>' +
                    '</div>' +
                    '<div class="staking-balance">' +
                        '<span data-i18n="staking.withdraw.balance">Staked:</span>' +
                        '<span data-staking-balance-withdraw>0</span>' +
                    '</div>' +
                    '<div class="staking-submit-wrapper">' +
                        '<button class="staking-submit staking-submit-withdraw" data-i18n="staking.withdraw.btn">Withdraw</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="staking-hint" data-i18n="staking.hint">Connect wallet to stake</div>' +
        '</div>';
    }

    function bindModalEvents() {
        if (!stakingModal) return;

        var closeBtn = stakingModal.querySelector('.staking-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeStakingModal);
        }

        stakingModal.addEventListener('click', function(e) {
            if (e.target === stakingModal) {
                closeStakingModal();
            }
        });

        var tabs = stakingModal.querySelectorAll('.staking-tab');
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                switchTab(this.getAttribute('data-tab'));
            });
        });

        var depositSubmit = stakingModal.querySelector('.staking-submit-deposit');
        if (depositSubmit) {
            depositSubmit.addEventListener('click', handleDeposit);
        }

        var withdrawSubmit = stakingModal.querySelector('.staking-submit-withdraw');
        if (withdrawSubmit) {
            withdrawSubmit.addEventListener('click', handleWithdraw);
        }

        var maxDepositBtn = stakingModal.querySelector('[data-staking-max-deposit]');
        if (maxDepositBtn) {
            maxDepositBtn.addEventListener('click', function() {
                var balance = stakingModal.querySelector('[data-staking-balance-deposit]');
                if (balance) {
                    var input = stakingModal.querySelector('[data-staking-input-deposit]');
                    if (input) input.value = balance.textContent || '0';
                }
            });
        }

        var maxWithdrawBtn = stakingModal.querySelector('[data-staking-max-withdraw]');
        if (maxWithdrawBtn) {
            maxWithdrawBtn.addEventListener('click', function() {
                var balance = stakingModal.querySelector('[data-staking-balance-withdraw]');
                if (balance) {
                    var input = stakingModal.querySelector('[data-staking-input-withdraw]');
                    if (input) input.value = balance.textContent || '0';
                }
            });
        }
    }

    function bindDepositButtons() {
        document.querySelectorAll('.deposit-button').forEach(function(btn) {
            btn.addEventListener('click', openStakingModal);
        });
    }

    function setupLanguageListener() {
        if (typeof document !== 'undefined') {
            document.addEventListener('memechelin:languagechange', function() {
                if (stakingModal && stakingModal.classList.contains('open')) {
                    // Translations update via i18n system
                }
            });
        }
    }

    function openStakingModal() {
        if (!stakingModal) createStakingModal();
        stakingModal.classList.add('open');
        document.body.classList.add('fixed');
        activeTab = 'deposit';
        switchTab('deposit');
        applyModalTranslations();
        initWeb3();
    }

    function applyModalTranslations() {
        if (typeof window === 'undefined' || !window.MEMEchelinI18n) return;
        var lang = document.documentElement.getAttribute('lang') === 'zh-CN' ? 'zh' : 'en';
        var copy = window.MEMEchelinI18n.getTranslations(lang);

        var nodes = stakingModal.querySelectorAll('[data-i18n]');
        nodes.forEach(function(node) {
            var key = node.getAttribute('data-i18n');
            if (copy[key] !== undefined) {
                node.textContent = copy[key];
            }
        });
    }

    function closeStakingModal() {
        if (stakingModal) {
            stakingModal.classList.remove('open');
            document.body.classList.remove('fixed');
        }
        if (refreshInterval) {
            clearInterval(refreshInterval);
            refreshInterval = null;
        }
    }

    function switchTab(tab) {
        activeTab = tab;
        var tabs = stakingModal.querySelectorAll('.staking-tab');
        tabs.forEach(function(t) {
            t.classList.toggle('active', t.getAttribute('data-tab') === tab);
        });

        var forms = stakingModal.querySelectorAll('.staking-form-tab');
        forms.forEach(function(f) {
            f.classList.toggle('active', f.getAttribute('data-form') === tab);
        });
    }

    async function initWeb3() {
        if (typeof window === 'undefined') return;

        var win = window;
        if (typeof win.ethereum !== 'undefined') {
            provider = new win.ethers.providers.Web3Provider(win.ethereum);
            signer = provider.getSigner();
            try {
                userAddress = await signer.getAddress();
                contract = new win.ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
                await loadStakingData();
                startAutoRefresh();
            } catch (err) {
                console.warn('Wallet not connected or contract not found:', err);
                // Show demo data
                loadDemoData();
            }
        } else {
            loadDemoData();
        }
    }

    async function loadStakingData() {
        if (!contract || !userAddress) {
            loadDemoData();
            return;
        }

        try {
            var tvl = await contract.getTotalDeposited();
            var apy = await contract.getCurrentAPY();
            var userInfo = await contract.getUserInvestInfo(PID, userAddress);
            var pending = await contract.getPendingReward(PID, userAddress);

            var tvlFormatted = formatNumber(tvl, 2);
            var apyFormatted = formatAPY(apy);
            var depositedFormatted = formatNumber(userInfo.depositedAmount, 2);
            var pendingFormatted = formatNumber(pending, 2);

            updateModalStat('data-staking-tvl', '$' + tvlFormatted);
            updateModalStat('data-staking-apy', apyFormatted);
            updateModalStat('data-staking-your', '$' + depositedFormatted);
            updateModalStat('data-staking-pending', '$' + pendingFormatted);

            var depositBalance = stakingModal.querySelector('[data-staking-balance-deposit]');
            if (depositBalance) depositBalance.textContent = formatToken(userInfo.depositedAmount);

            var withdrawBalance = stakingModal.querySelector('[data-staking-balance-withdraw]');
            if (withdrawBalance) withdrawBalance.textContent = formatToken(userInfo.depositedAmount);

            setHint('');
        } catch (err) {
            console.error('Error loading staking data:', err);
            loadDemoData();
        }
    }

    function loadDemoData() {
        updateModalStat('data-staking-tvl', '$12,800,000');
        updateModalStat('data-staking-apy', '18.6%');
        updateModalStat('data-staking-your', '$0');
        updateModalStat('data-staking-pending', '$0');

        var depositBalance = stakingModal.querySelector('[data-staking-balance-deposit]');
        if (depositBalance) depositBalance.textContent = '0';

        var withdrawBalance = stakingModal.querySelector('[data-staking-balance-withdraw]');
        if (withdrawBalance) withdrawBalance.textContent = '0';

        setHint('Demo mode - contract not configured');
    }

    function startAutoRefresh() {
        if (refreshInterval) clearInterval(refreshInterval);
        refreshInterval = setInterval(loadStakingData, 10000);
    }

    function updateModalStat(attr, value) {
        if (!stakingModal) return;
        var el = stakingModal.querySelector('[' + attr + ']');
        if (el) el.textContent = value;
    }

    function setHint(text) {
        if (!stakingModal) return;
        var hint = stakingModal.querySelector('.staking-hint');
        if (hint) hint.textContent = text;
    }

    async function handleDeposit() {
        if (!stakingModal) return;
        var input = stakingModal.querySelector('[data-staking-input-deposit]');
        var amount = input ? input.value : '';

        if (!amount || parseFloat(amount) <= 0) {
            setHint('Please enter a valid amount');
            return;
        }

        if (!contract || !signer) {
            setHint('Please connect your wallet');
            return;
        }

        var submitBtn = stakingModal.querySelector('.staking-submit-deposit');
        if (submitBtn) {
            submitBtn.textContent = 'Depositing...';
            submitBtn.disabled = true;
        }

        try {
            var amountWei = parseToken(amount);
            var tx = await contract.deposit(PID, amountWei);
            setHint('Transaction submitted...');
            await tx.wait();
            setHint('Deposit successful!');
            input.value = '';
            await loadStakingData();
        } catch (err) {
            console.error('Deposit error:', err);
            setHint('Deposit failed: ' + (err.message || 'Unknown error'));
        } finally {
            if (submitBtn) {
                submitBtn.textContent = getText('staking.deposit.btn') || 'Deposit';
                submitBtn.disabled = false;
            }
        }
    }

    async function handleWithdraw() {
        if (!stakingModal) return;
        var input = stakingModal.querySelector('[data-staking-input-withdraw]');
        var amount = input ? input.value : '';

        if (!amount || parseFloat(amount) <= 0) {
            setHint('Please enter a valid amount');
            return;
        }

        if (!contract || !signer) {
            setHint('Please connect your wallet');
            return;
        }

        var submitBtn = stakingModal.querySelector('.staking-submit-withdraw');
        if (submitBtn) {
            submitBtn.textContent = 'Withdrawing...';
            submitBtn.disabled = true;
        }

        try {
            var amountWei = parseToken(amount);
            var tx = await contract.withdraw(PID, amountWei);
            setHint('Transaction submitted...');
            await tx.wait();
            setHint('Withdraw successful!');
            input.value = '';
            await loadStakingData();
        } catch (err) {
            console.error('Withdraw error:', err);
            setHint('Withdraw failed: ' + (err.message || 'Unknown error'));
        } finally {
            if (submitBtn) {
                submitBtn.textContent = getText('staking.withdraw.btn') || 'Withdraw';
                submitBtn.disabled = false;
            }
        }
    }

    function formatNumber(value, decimals) {
        if (!value) return '0';
        var num = Number(value);
        if (Number.isNaN(num)) return '0';

        if (num >= 1000000) {
            return (num / 1000000).toFixed(decimals) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(decimals) + 'K';
        }
        return num.toFixed(decimals);
    }

    function formatAPY(apy) {
        if (!apy) return '0%';
        var num = Number(apy);
        if (Number.isNaN(num)) return '0%';
        return (num / 100).toFixed(1) + '%';
    }

    function formatToken(value) {
        if (!value) return '0';
        var num = Number(value);
        if (Number.isNaN(num)) return '0';
        return num.toFixed(4);
    }

    function parseToken(value) {
        var num = parseFloat(value);
        if (Number.isNaN(num)) return 0;
        // Assuming 18 decimals
        return Math.floor(num * Math.pow(10, 18));
    }

    function getText(key) {
        if (typeof window === 'undefined' || !window.MEMEchelinI18n) return key;
        var lang = document.documentElement.getAttribute('lang') === 'zh-CN' ? 'zh' : 'en';
        var copy = window.MEMEchelinI18n.getTranslations(lang);
        return copy[key] || key;
    }

    init();

    return {
        openStakingModal: openStakingModal,
        closeStakingModal: closeStakingModal,
    };
});