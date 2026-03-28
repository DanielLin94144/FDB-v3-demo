// ===================== DATA =====================
const MODELS = [
  { name: 'GPT-Realtime', color: '#10a37f' },
  { name: 'Gemini 2.5',   color: '#4285f4' },
  { name: 'Gemini 3.1',   color: '#1a73e8' },
  { name: 'Nova Sonic 2',  color: '#ff6600' },
  { name: 'Grok',          color: '#1d9bf0' },
  { name: 'Ultravox',      color: '#7c3aed' },
  { name: 'Cascaded',      color: '#6b7280' },
];

const DATA = {
  difficulty: {
    categories: ['Easy', 'Medium', 'Hard'],
    values: [
      [0.667, 0.486, 0.400],  // GPT
      [0.556, 0.371, 0.400],  // Gemini 2.5
      [0.639, 0.400, 0.400],  // Gemini 3.1
      [0.528, 0.314, 0.200],  // Nova Sonic
      [0.500, 0.314, 0.300],  // Grok
      [0.667, 0.420, 0.333],  // Ultravox
      [0.611, 0.343, 0.233],  // Cascaded
    ]
  },
  disfluency: {
    categories: ['Filler', 'Pause', 'Hesitation', 'False Start', 'Self-Corr'],
    values: [
      [0.552, 0.333, 0.500, 0.583, 0.353],
      [0.483, 0.389, 0.500, 0.500, 0.529],
      [0.483, 0.556, 0.600, 0.583, 0.353],
      [0.379, 0.333, 0.500, 0.500, 0.176],
      [0.414, 0.333, 0.300, 0.500, 0.294],
      [0.517, 0.500, 0.600, 0.583, 0.235],
      [0.448, 0.389, 0.600, 0.417, 0.176],
    ]
  },
  domain: {
    categories: ['Ecommerce', 'Finance', 'Housing', 'Travel'],
    values: [
      [0.552, 0.840, 0.192, 0.524],
      [0.483, 0.720, 0.192, 0.381],
      [0.483, 0.640, 0.308, 0.524],
      [0.345, 0.640, 0.115, 0.444],
      [0.414, 0.520, 0.154, 0.429],
      [0.310, 0.600, 0.154, 0.429],
      [0.310, 0.560, 0.115, 0.286],
    ]
  },
  latency: {
    categories: ['First Word (s)', 'Tool Call (s)', 'Task Completion (s)'],
    values: [
      [5.61, 4.45, 6.72],
      [5.26, 4.77, 5.68],
      [7.56, 3.51, 8.64],
      [7.29, 2.83, 8.72],
      [7.63, 4.02, 8.75],
      [7.79, 4.41, 9.34],
      [7.80, 4.24, 8.84],
    ]
  }
};

// ===================== DEMO EXAMPLES =====================
const DEMOS = [
  {
    id: 'ecommerce_02',
    speaker: '5f4a4da1575d605c43bef871',
    domain: 'ecommerce',
    title: 'Simple Product Search',
    transcript: "I'm looking for a pair of wireless headphones and I'd like um to track it under a hundred dollars if possible. What do you have?",
    difficulty: 'Easy',
  },
  {
    id: 'finance_22',
    speaker: '5f4a4da1575d605c43bef871',
    domain: 'finance',
    title: 'Heavy Fillers + Dual Autopay',
    transcript: "First, I want to change my mortgage auto pay so it pulls from savings. That's the right account for that. Then I also want to set my credit card payment to come from my checking.",
    difficulty: 'Medium',
  },
  {
    id: 'housing_22',
    speaker: '695bd157114f0d2317f88617',
    domain: 'housing',
    title: 'Filler-Heavy Multi-Tool Chain',
    transcript: "You know, um, can you first update my filter to allow pets and then search for apartments under $1200 with parking?",
    difficulty: 'Hard',
  },
  {
    id: 'travel_10',
    speaker: '5f4a4da1575d605c43bef871',
    domain: 'travel',
    title: 'Date Correction with Fillers',
    transcript: "Looking at flights to Miami on October 5th. Oh, wait. My schedule just changed. My meeting got moved, so actually make it October 7th instead.",
    difficulty: 'Medium',
  },
  {
    id: 'ecommerce_17',
    speaker: '5f4a4da1575d605c43bef871',
    domain: 'ecommerce',
    title: 'False Start then Track',
    transcript: "Can you cancel my actually, never mind the cancellation. I changed my mind about that. Can you just track order GG5 for me instead? I want to see where it is.",
    difficulty: 'Medium',
  },
  {
    id: 'housing_18',
    speaker: '66c4f3cb14cbfc4db836bd4e',
    domain: 'housing',
    title: 'Search + Commute Chain',
    transcript: "Well so first, search for a one-bedroom in Portland that's under $800 per month, then once you find the cheapest option, check how long it would take to bike from there to the coffee shop on 5th Street where I work.",
    difficulty: 'Hard',
  },
];

const PROVIDERS = [
  { key: 'openai',     label: 'GPT-Realtime',  color: '#10a37f' },
  { key: 'google',     label: 'Gemini 2.5',     color: '#4285f4' },
  { key: 'gemini3_1',  label: 'Gemini 3.1',     color: '#1a73e8' },
  { key: 'nova_sonic', label: 'Nova Sonic 2',   color: '#ff6600' },
  { key: 'xai',        label: 'Grok',           color: '#1d9bf0' },
  { key: 'ultravox',   label: 'Ultravox',       color: '#7c3aed' },
  { key: 'cascaded',   label: 'Cascaded',       color: '#6b7280' },
];

// ===================== CHART RENDERING =====================
function renderGroupedBarChart(containerId, data, maxValue, isLatency = false) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const scale = isLatency ? 10 : 1;
  const barMaxWidth = 500;

  data.categories.forEach((cat, ci) => {
    // Category header
    const header = document.createElement('div');
    header.className = 'chart-category-header';
    header.textContent = cat;
    container.appendChild(header);

    MODELS.forEach((model, mi) => {
      const val = data.values[mi][ci];
      const row = document.createElement('div');
      row.className = 'chart-row';

      const label = document.createElement('div');
      label.className = 'chart-label';
      label.textContent = model.name;

      const barsWrap = document.createElement('div');
      barsWrap.className = 'chart-bars';

      const bar = document.createElement('div');
      bar.className = 'chart-bar';
      const widthPct = (val / scale) * barMaxWidth;
      bar.style.width = widthPct + 'px';
      bar.style.background = model.color;
      bar.title = `${model.name}: ${val}`;

      const barLabel = document.createElement('span');
      barLabel.className = 'chart-bar-label';
      barLabel.textContent = isLatency ? val.toFixed(2) + 's' : val.toFixed(3);

      bar.appendChild(barLabel);
      barsWrap.appendChild(bar);
      row.appendChild(label);
      row.appendChild(barsWrap);
      container.appendChild(row);
    });
  });
}

function initCharts() {
  renderGroupedBarChart('chart-difficulty', DATA.difficulty, 1);
  renderGroupedBarChart('chart-disfluency', DATA.disfluency, 1);
  renderGroupedBarChart('chart-domain', DATA.domain, 1);
  renderGroupedBarChart('chart-latency', DATA.latency, 10, true);
}

// ===================== TABS =====================
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + tab).classList.add('active');
    });
  });
}

// ===================== AUDIO DEMOS =====================
function renderDemos(filter = 'all') {
  const list = document.getElementById('demos-list');
  list.innerHTML = '';

  const filtered = filter === 'all' ? DEMOS : DEMOS.filter(d => d.domain === filter);

  filtered.forEach(demo => {
    const basePath = `audio/example_${demo.id}`;

    const card = document.createElement('div');
    card.className = 'demo-card';
    card.dataset.domain = demo.domain;

    const domainMap = {
      travel: 'Travel & Identity',
      finance: 'Finance & Billing',
      housing: 'Housing & Location',
      ecommerce: 'E-Commerce',
    };

    card.innerHTML = `
      <div class="demo-card-header">
        <div class="demo-meta">
          <span class="demo-domain-badge" data-domain="${demo.domain}">${domainMap[demo.domain]}</span>
          <span class="demo-difficulty">${demo.difficulty}</span>
        </div>
        <div class="demo-title">${demo.title}</div>
        <div class="demo-transcript">"${demo.transcript}"</div>
      </div>
      <div class="demo-card-body">
        <p class="demo-channel-hint">Stereo: Left channel = User, Right channel = Agent</p>
        <div class="demo-audio-row">
          <div class="demo-audio-label">
            <span class="model-dot" style="--dot-color:#e11d48"></span>
            User Input Only
          </div>
          <audio controls preload="none" src="${basePath}/input.wav"></audio>
        </div>
        ${PROVIDERS.map(p => `
          <div class="demo-audio-row">
            <div class="demo-audio-label">
              <span class="model-dot" style="--dot-color:${p.color}"></span>
              ${p.label}
            </div>
            <audio controls preload="none" src="${basePath}/merged_${p.key}.wav"></audio>
          </div>
        `).join('')}
      </div>
    `;

    list.appendChild(card);
  });
}

function initDemoFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDemos(btn.dataset.filter);
    });
  });
}

// ===================== COPY CITATION =====================
function initCopyBtn() {
  const btn = document.getElementById('copy-btn');
  const code = document.getElementById('bibtex');
  if (!btn || !code) return;

  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(code.textContent).then(() => {
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.innerHTML = '&#128203; Copy'; }, 2000);
    });
  });
}

// ===================== FLOATING NAV =====================
function initFloatingNav() {
  const nav = document.getElementById('floating-nav');
  const heroSection = document.querySelector('.hero');

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      nav.classList.remove('visible');
    } else {
      nav.classList.add('visible');
    }
  }, { threshold: 0 });

  observer.observe(heroSection);

  // Active link tracking
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = nav.querySelectorAll('a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => sectionObserver.observe(s));
}

// ===================== ANIMATE ON SCROLL =====================
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.highlight-card, .domain-card, .flow-step, .finding, .disfluency-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
  initCharts();
  initTabs();
  renderDemos();
  initDemoFilters();
  initCopyBtn();
  initFloatingNav();
  initScrollAnimations();
});
