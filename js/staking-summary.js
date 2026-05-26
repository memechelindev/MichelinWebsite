(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.MEMEchelinStakingSummary = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
    var DEFAULT_TOTAL = 12800000;
    var DEFAULT_APY = 18.6;
    var UPDATE_INTERVAL = 2600;

    function toFiniteNumber(value, fallback) {
        var number = Number(value);
        return Number.isFinite(number) ? number : fallback;
    }

    function formatFullUsd(value) {
        if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
            }).format(value);
        }

        return '$' + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function formatApy(value) {
        return value.toFixed(1) + '%';
    }

    function renderAnimatedText(node, text) {
        node.textContent = '';

        Array.prototype.forEach.call(String(text), function(character, index) {
            var span = document.createElement('span');
            span.textContent = character;

            if (/\d/.test(character)) {
                span.className = 'staking-summary-digit';
                span.style.setProperty('--digit-index', index);
            }

            node.appendChild(span);
        });
    }

    function render(rootNode, state) {
        var totalNode = rootNode.querySelector('[data-staking-total]');
        var apyNode = rootNode.querySelector('[data-staking-apy]');

        if (totalNode) {
            renderAnimatedText(totalNode, formatFullUsd(state.total));
        }

        if (apyNode) {
            apyNode.textContent = formatApy(state.apy);
        }
    }

    function animateTotal(rootNode) {
        var totalNode = rootNode.querySelector('[data-staking-total]');

        return setInterval(function() {
            if (!totalNode) {
                return;
            }

            Array.prototype.forEach.call(totalNode.querySelectorAll('.staking-summary-digit'), function(node) {
                node.classList.remove('is-jumping');
            });

            void totalNode.offsetWidth;

            Array.prototype.forEach.call(totalNode.querySelectorAll('.staking-summary-digit'), function(node) {
                node.classList.add('is-jumping');
            });
        }, UPDATE_INTERVAL);
    }

    function applyPayload(rootNode, state, payload) {
        state.total = toFiniteNumber(payload && payload.totalStaked, state.total);
        state.apy = toFiniteNumber(payload && payload.apy, state.apy);
        render(rootNode, state);
    }

    function loadFromApi(rootNode, state) {
        var endpoint = rootNode.getAttribute('data-staking-endpoint');

        if (!endpoint || typeof fetch !== 'function') {
            return Promise.resolve(false);
        }

        return fetch(endpoint, { cache: 'no-store' })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Staking summary request failed');
                }
                return response.json();
            })
            .then(function(payload) {
                applyPayload(rootNode, state, payload);
                return true;
            })
            .catch(function() {
                render(rootNode, state);
                return false;
            });
    }

    function init(doc) {
        doc = doc || document;

        Array.prototype.forEach.call(doc.querySelectorAll('[data-staking-summary]'), function(rootNode) {
            var totalNode = rootNode.querySelector('[data-staking-total]');
            var apyNode = rootNode.querySelector('[data-staking-apy]');
            var state = {
                total: toFiniteNumber(totalNode && totalNode.getAttribute('data-staking-fallback'), DEFAULT_TOTAL),
                apy: toFiniteNumber(apyNode && apyNode.getAttribute('data-staking-fallback'), DEFAULT_APY),
            };

            render(rootNode, state);
            loadFromApi(rootNode, state);
            animateTotal(rootNode);
        });
    }

    if (typeof document !== 'undefined') {
        document.addEventListener('DOMContentLoaded', function() {
            init(document);
        });
    }

    return {
        applyPayload: applyPayload,
        formatApy: formatApy,
        formatFullUsd: formatFullUsd,
        init: init,
    };
});
