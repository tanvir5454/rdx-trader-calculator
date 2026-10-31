const balanceInput = document.getElementById('balance');
const money = value => '$' + value.toLocaleString('en-US', {minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2});
const multipliers = [1, 2, 5, 10, 50, 100];
function calculate() {
  const balance = Number(balanceInput.value);
  const valid = Number.isFinite(balance) && balance > 0;
  const minimum = valid ? balance * 50 : 0;
  document.getElementById('minimum').textContent = money(minimum);
  document.getElementById('minReward').textContent = money(minimum * .1);
  const tbody = document.getElementById('projections');
  tbody.replaceChildren();
  if (!valid) return;
  multipliers.forEach((multiple, index) => {
    const turnover = minimum * multiple;
    const tr = document.createElement('tr');
    const first = document.createElement('td');
    first.textContent = money(turnover);
    if (index === 0) {
      const label = document.createElement('span');
      label.className = 'min'; label.textContent = 'MIN'; first.append(label);
    }
    const second = document.createElement('td');
    second.textContent = money(turnover * .1);
    tr.append(first, second); tbody.append(tr);
  });
}
balanceInput.addEventListener('input', calculate);
document.getElementById('copy').addEventListener('click', async () => {
  const balance = Number(balanceInput.value);
  if (!(balance > 0)) { document.getElementById('copyStatus').textContent = 'Enter a valid balance first.'; return; }
  const min = balance * 50;
  const summary = ['RDX TRADER — Reward Projection', `Balance: ${money(balance)}`, `Minimum turnover: ${money(min)}`, `Reward at minimum: ${money(min * .1)}`, ...multipliers.map(m => `${money(min * m)} turnover → ${money(min * m * .1)} reward`), 'Estimates only; program rules apply.'].join('\n');
  try { await navigator.clipboard.writeText(summary); document.getElementById('copyStatus').textContent = 'Reward summary copied!'; }
  catch { document.getElementById('copyStatus').textContent = 'Copy unavailable here; try opening the calculator over HTTPS.'; }
});
calculate();
