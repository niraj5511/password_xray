(function(){
  const pw = document.getElementById('pw');
  const beam = document.getElementById('beam');
  const bitsOut = document.getElementById('bitsOut');
  const crackOut = document.getElementById('crackOut');
  const gaugeFill = document.getElementById('gaugeFill');
  const lengthDots = document.getElementById('lengthDots');
  const demoBtn = document.getElementById('demoBtn');

  const MAX_DOTS = 24;
  const CIRC = 527.8;

  for (let i = 0; i < MAX_DOTS; i++) {
    const d = document.createElement('div');
    d.className = 'dot';
    lengthDots.appendChild(d);
  }
  const dotEls = Array.from(lengthDots.children);

  function classify(str) {
    const has = { lower:false, upper:false, digit:false, symbol:false };
    for (const ch of str) {
      if (/[a-z]/.test(ch)) has.lower = true;
      else if (/[A-Z]/.test(ch)) has.upper = true;
      else if (/[0-9]/.test(ch)) has.digit = true;
      else if (/\S/.test(ch)) has.symbol = true;
    }
    let pool = 0;
    if (has.lower) pool += 26;
    if (has.upper) pool += 26;
    if (has.digit) pool += 10;
    if (has.symbol) pool += 32;
    return { has, pool };
  }

  function formatCrackTime(bits) {
    const guesses = Math.pow(2, bits);
    const perSecond = 1e10;
    const seconds = guesses / perSecond / 2;
    if (seconds < 1) return 'instant';
    const units = [
      ['centuries', 60*60*24*365*100],
      ['years', 60*60*24*365],
      ['days', 60*60*24],
      ['hours', 60*60],
      ['minutes', 60],
      ['seconds', 1]
    ];
    for (const [name, secs] of units) {
      if (seconds >= secs) {
        const val = seconds / secs;
        return (val > 999 ? val.toExponential(1) : val.toFixed(val < 10 ? 1 : 0)) + ' ' + name;
      }
    }
    return 'instant';
  }

  function tierColor(bits) {
    if (bits < 35) return getComputedStyle(document.documentElement).getPropertyValue('--weak').trim();
    if (bits < 65) return getComputedStyle(document.documentElement).getPropertyValue('--mid').trim();
    return getComputedStyle(document.documentElement).getPropertyValue('--strong').trim();
  }

  function update() {
    const val = pw.value;
    const { has, pool } = classify(val);
    const bits = val.length > 0 ? Math.round(val.length * Math.log2(Math.max(pool,1))) : 0;

    bitsOut.textContent = bits;
    crackOut.textContent = val.length ? formatCrackTime(bits) : 'instant';

    const pct = Math.min(1, bits / 100);
    gaugeFill.style.strokeDashoffset = CIRC * (1 - pct);
    const color = tierColor(bits);
    gaugeFill.style.stroke = color;
    gaugeFill.style.color = color;
    crackOut.style.color = color;

    dotEls.forEach((d, i) => d.classList.toggle('on', i < val.length));

    for (const key of ['lower','upper','digit','symbol']) {
      document.getElementById('badge-'+key).classList.toggle('on', has[key]);
    }
  }

  function fireBeam() {
    beam.classList.remove('run');
    void beam.offsetWidth;
    beam.classList.add('run');
  }

  pw.addEventListener('input', () => { update(); fireBeam(); });

  const DEMOS = ['password', 'Passw0rd', 'Tr0ub4dor&3', 'correct-horse-battery-staple-92!'];
  let busy = false;
  function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

  async function runDemo() {
    if (busy) return;
    busy = true; demoBtn.disabled = true;
    for (const d of DEMOS) {
      pw.value = '';
      update();
      for (let i = 0; i < d.length; i++) {
        pw.value += d[i];
        update();
        fireBeam();
        await sleep(60);
      }
      await sleep(1700);
    }
    busy = false; demoBtn.disabled = false;
  }
  demoBtn.addEventListener('click', runDemo);

  update();
})();