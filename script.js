/* ═══════════════════════════════════════════════════════════
   LP REFRESHER COURSE LIBRARY — script.js
   The Patient Investor Mastermind
═══════════════════════════════════════════════════════════ */

// ─── LESSON DATA ─────────────────────────────────────────
// Edit this array to update lesson content. Keep IDs sequential.
const LESSONS = [
  {
    id: 1,
    title: 'Curriculum Overview',
    description: 'Introduction to the series and what members need for success.',
    greg: 'https://youtu.be/uZm_2Ms9u-I',
    shane: 'https://youtu.be/ewvcDbz2bGA',
    homework: 'https://drive.google.com/file/d/1g5XAAccUI-5NuK7zp2oVsTyr5JaQJhD6/view',
  },
  {
    id: 2,
    title: 'MetaMask + Trezor + Networks',
    description: 'Core wallet setup, integration, network basics, and taxes overview.',
    greg: 'https://youtu.be/f3Ugg3YckEI',
    shane: 'https://youtu.be/hTKcbTgoSPU',
    homework: 'https://drive.google.com/file/d/1HEvspHL3tOCfnOxCGrAy4B0nuLbwqHS6/view',
  },
  {
    id: 3,
    title: 'Purchase Crypto',
    description: 'How to use Coinbase Advanced and send funds safely.',
    greg: 'https://youtu.be/_oMw9pPnX6k',
    shane: 'https://youtu.be/-wohu_T5Oik',
    homework: 'https://drive.google.com/file/d/1MW9oeb2Ac8de2iDUkAxd92jZoCnWs7Y0/view',
  },
  {
    id: 4,
    title: 'Intro to Liquidity Pools',
    description: 'Understand TVL, volume, and the basics of pool research.',
    greg: 'https://youtu.be/f2ck8QanijY',
    shane: 'https://youtu.be/Xkaxx6zxVD8',
    homework: 'https://drive.google.com/file/d/1TLPjEX1EKD6An1dzekvbfZOz2yHWJv1D/view',
  },
  {
    id: 5,
    title: 'Opening Liquidity Positions',
    description: 'Move from theory into actual execution with test positions.',
    greg: 'https://rumble.com/v76651i-mastermind-call-with-greg-how-to-open-positions.html',
    shane: 'https://youtu.be/YLZ5hZNKiTc',
    homework: 'https://drive.google.com/file/d/1a3ctWwTHP4X6FXK7wbsLV5a7ZuN8Q99D/view',
  },
  {
    id: 6,
    title: 'Average Volume and Asset Selection',
    description: 'How to choose stronger assets and avoid misleading pools.',
    greg: 'https://rumble.com/v768vvk-liquidity-providing-refresher-course-average-volume-and-asset-selection.html',
    shane: 'https://youtu.be/kRqgcOU8bo4',
    homework: 'https://drive.google.com/file/d/1WKcusCcEniKQE2p1XBpOzWv81TEgyHWq/view',
  },
  {
    id: 7,
    title: 'Setting Range',
    description: 'How to define price boundaries and build better entries.',
    greg: 'https://rumble.com/v76vbmg-how-to-set-range.html',
    shane: 'https://youtu.be/M4r99gqnkLg',
    homework: 'https://drive.google.com/file/d/1sTipIiP7FVg5Qf3Ngw9gtbBgtJhEeiX6/view',
  },
  {
    id: 8,
    title: 'Putting Things Together',
    description: 'A full walkthrough from research to opening test positions.',
    greg: 'https://rumble.com/v77anfo-the-full-process-of-doing-research.html',
    shane: 'https://youtu.be/gudq0Gc1kBQ',
    homework: 'https://drive.google.com/file/d/1-G-Df9vm3WGKpQmDXLG2gLaQuqcp4Qb4/view',
  },
  {
    id: 9,
    title: 'Managing Your Pool',
    description: 'Learn rebalancing, adding/removing liquidity, claiming fees, compounding, and closing positions.',
    greg: 'https://rumble.com/v77anqy-rebalancing-adding-liquidity-removing-liquidity-claiming-fees.html',
    shane: 'https://youtu.be/YRfQO82Phjo',
    homework: 'https://drive.google.com/file/d/1ug-TIcYhuRFGskN7V-3R0OFZojMK1nZ7/view',
  },
  {
    id: 10,
    title: 'Staying in Range — Correlations Strategy',
    description: 'Learn how correlated assets help keep positions in range longer.',
    greg: 'https://rumble.com/v77illm-refresher-course-correlations.html',
    shane: 'https://youtu.be/sr7_E5XqQfI',
    homework: 'https://drive.google.com/file/d/19qtBX5PA2xu_d1TRLpcjTD0A_IsbjtMt/view',
  },
  {
    id: 11,
    title: 'What to Do With Your Fees — Bull Market Portfolio Setup',
    description: 'Reinvest earned fees into high-conviction coins to build zero-cost-basis bull market positions.',
    greg: 'https://youtu.be/DsVhtCI7iLs',
    shane: null,
    homework: null,
  },
  {
    id: 12,
    title: 'What to Do With Your Fees — Moving From Arbitrum Into Other Networks',
    description: 'Use Rubik to bridge and swap across networks, landing with the right gas tokens to deploy capital.',
    greg: 'https://youtu.be/21WoN7LOiEk',
    shane: null,
    homework: null,
  },
];

// ─── PERSISTENCE ─────────────────────────────────────────
const STORAGE_KEY = 'lp-refresher-completed-lessons';

function loadCompletedLessons() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveCompletedLessons(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // localStorage unavailable — graceful no-op
  }
}

// ─── STATE ───────────────────────────────────────────────
let completedLessons = loadCompletedLessons();

// ─── COMPUTED STATUS ─────────────────────────────────────
// Returns 'start-here' | 'next-up' | 'completed' | 'default'
function getLessonStatus(lesson, firstIncompleteId) {
  if (completedLessons.has(lesson.id)) return 'completed';
  if (lesson.id === 1 && firstIncompleteId === 1) return 'start-here';
  if (lesson.id === firstIncompleteId) return 'next-up';
  return 'default';
}

function getFirstIncompleteId() {
  const incomplete = LESSONS.find(l => !completedLessons.has(l.id));
  return incomplete ? incomplete.id : null;
}

// ─── SVG ICONS ───────────────────────────────────────────
const ICON_PLAY = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 3l14 9-14 9V3z"/></svg>`;
const ICON_DOC  = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

// ─── RENDER: PATH STEPPER ─────────────────────────────────
function renderPathStepper() {
  const container = document.getElementById('path-steps');
  if (!container) return;
  const firstIncompleteId = getFirstIncompleteId();
  container.innerHTML = '';

  LESSONS.forEach(lesson => {
    const isCompleted = completedLessons.has(lesson.id);
    const isNext = lesson.id === firstIncompleteId;

    const step = document.createElement('a');
    step.href = `#lesson-${lesson.id}`;
    step.setAttribute('role', 'listitem');
    step.setAttribute('aria-label', `Lesson ${lesson.id}: ${lesson.title}${isCompleted ? ' (completed)' : isNext ? ' (next up)' : ''}`);
    step.className = [
      'path-step',
      isCompleted ? 'step-completed' : '',
      isNext ? 'step-next' : '',
    ].filter(Boolean).join(' ');

    step.innerHTML = `
      <div class="path-step-number" aria-hidden="true">${isCompleted ? '✓' : lesson.id}</div>
      <div class="path-step-label">${lesson.title}</div>
    `;

    container.appendChild(step);
  });
}

// ─── RENDER: LESSON CARDS ─────────────────────────────────
function renderLessonCards() {
  const grid = document.getElementById('lessons-grid');
  if (!grid) return;
  const firstIncompleteId = getFirstIncompleteId();
  grid.innerHTML = '';

  LESSONS.forEach(lesson => {
    const status = getLessonStatus(lesson, firstIncompleteId);

    const wrapper = document.createElement('div');
    wrapper.className = 'lesson-wrapper';

    const heading = document.createElement('h2');
    heading.className = 'lesson-heading';
    heading.textContent = `Lesson ${lesson.id}`;

    const card = buildCard(lesson, status);

    wrapper.appendChild(heading);
    wrapper.appendChild(card);
    grid.appendChild(wrapper);
  });
}

function buildCard(lesson, status) {
  const isCompleted = status === 'completed';
  const isNextUp    = status === 'next-up';
  const isStartHere = status === 'start-here';

  // Card element
  const card = document.createElement('article');
  card.id = `lesson-${lesson.id}`;
  card.setAttribute('role', 'listitem');
  card.setAttribute('aria-label', `Lesson ${lesson.id}: ${lesson.title}`);
  card.className = [
    'lesson-card',
    isCompleted ? 'is-completed' : '',
    isNextUp    ? 'is-next-up'  : '',
    isStartHere ? 'is-next-up'  : '', // start-here also gets next-up glow styling
  ].filter(Boolean).join(' ');

  // Badges
  let badgesHTML = '';
  if (isStartHere) badgesHTML += `<span class="badge badge-start-here">Start Here</span>`;
  if (isNextUp)    badgesHTML += `<span class="badge badge-next-up">Next Up</span>`;
  if (isCompleted) badgesHTML += `<span class="badge badge-completed">✓ Completed</span>`;

  card.innerHTML = `
    <div class="card-header">
      <div class="card-badges">${badgesHTML}</div>
    </div>

    <h3 class="card-title">${escapeHtml(lesson.title)}</h3>
    <p class="card-description">${escapeHtml(lesson.description)}</p>

    <div class="card-buttons">
      <div class="btn-watch-row">
        <a href="${lesson.greg}" target="_blank" rel="noopener noreferrer" class="btn-greg" aria-label="Watch Greg's version of Lesson ${lesson.id}: ${lesson.title}">
          ${ICON_PLAY} Watch Greg
        </a>
        ${lesson.shane
          ? `<a href="${lesson.shane}" target="_blank" rel="noopener noreferrer" class="btn-shane" aria-label="Watch Shane's version of Lesson ${lesson.id}: ${lesson.title}">
              ${ICON_PLAY} Watch Shane
            </a>`
          : `<span class="btn-shane is-disabled" aria-disabled="true" title="Shane's version coming soon">
              ${ICON_PLAY} Shane — Coming Soon
            </span>`}
      </div>
      ${lesson.homework
        ? `<a href="${lesson.homework}" target="_blank" rel="noopener noreferrer" class="btn-homework" aria-label="Open homework for Lesson ${lesson.id}: ${lesson.title}">
            ${ICON_DOC} Homework
          </a>`
        : `<span class="btn-homework is-disabled" aria-disabled="true" title="Homework coming soon">
            ${ICON_DOC} Homework — Coming Soon
          </span>`}
    </div>

    <div class="card-footer">
      <label class="complete-label">
        <input
          type="checkbox"
          ${isCompleted ? 'checked' : ''}
          aria-label="Mark Lesson ${lesson.id} as ${isCompleted ? 'incomplete' : 'complete'}"
          data-lesson-id="${lesson.id}"
        />
        Mark complete
      </label>
    </div>
  `;

  // Attach toggle listener
  const checkbox = card.querySelector('input[type="checkbox"]');
  checkbox.addEventListener('change', () => {
    toggleComplete(lesson.id);
  });

  return card;
}

// ─── RENDER: PROGRESS ────────────────────────────────────
function updateProgress() {
  const count = completedLessons.size;
  const total = LESSONS.length;
  const pct   = total > 0 ? (count / total) * 100 : 0;

  // Update text
  const progressText = document.getElementById('progress-text');
  if (progressText) progressText.textContent = `${count} of ${total} completed`;

  // Update bar
  const fill = document.getElementById('progress-bar-fill');
  if (fill) {
    fill.style.width = `${pct}%`;
    const wrap = fill.closest('[role="progressbar"]');
    if (wrap) wrap.setAttribute('aria-valuenow', count);
  }

  // Show/hide all-complete banner
  const banner = document.getElementById('all-complete-banner');
  if (banner) {
    banner.hidden = count < total;
  }
}

// ─── TOGGLE COMPLETION ───────────────────────────────────
function toggleComplete(lessonId) {
  if (completedLessons.has(lessonId)) {
    completedLessons.delete(lessonId);
  } else {
    completedLessons.add(lessonId);
  }
  saveCompletedLessons(completedLessons);
  renderAll();
}

// ─── RENDER ALL ───────────────────────────────────────────
function renderAll() {
  renderPathStepper();
  renderLessonCards();
  updateProgress();
}

// ─── CTA HANDLERS ────────────────────────────────────────
function scrollToLesson(id) {
  const el = document.getElementById(`lesson-${id}`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('btn-start-here').addEventListener('click', () => {
  scrollToLesson(1);
});

document.getElementById('btn-continue').addEventListener('click', () => {
  const firstIncompleteId = getFirstIncompleteId();
  if (firstIncompleteId !== null) {
    scrollToLesson(firstIncompleteId);
  } else {
    // All complete — scroll to the banner
    const banner = document.getElementById('all-complete-banner');
    if (banner) banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

// ─── UTILITY ─────────────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── PASSWORD GATE ────────────────────────────────────────
const AUTH_KEY = 'lp-refresher-auth';
const CORRECT_PASSWORD = 'Inner Circle';

function initPasswordGate() {
  const gate = document.getElementById('password-gate');
  if (localStorage.getItem(AUTH_KEY) === '1') {
    gate.classList.add('hidden');
    return;
  }

  // Focus input on load
  document.getElementById('gate-input').focus();

  document.getElementById('gate-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const val = document.getElementById('gate-input').value;
    const errorEl = document.getElementById('gate-error');

    if (val === CORRECT_PASSWORD) {
      localStorage.setItem(AUTH_KEY, '1');
      gate.classList.add('hidden');
      initOnboarding();
    } else {
      errorEl.hidden = false;
      document.getElementById('gate-input').value = '';
      document.getElementById('gate-input').focus();
    }
  });
}

// ─── ONBOARDING ───────────────────────────────────────────
const ONBOARDING_KEY = 'lp-refresher-onboarding-seen';
const TOTAL_STEPS = 4;
let currentStep = 1;

function initOnboarding() {
  const alreadySeen = localStorage.getItem(ONBOARDING_KEY);
  if (alreadySeen) return;

  const backdrop = document.getElementById('onboarding-backdrop');
  backdrop.hidden = false;
  // Trap focus inside modal when open
  backdrop.querySelector('.ob-btn-next').focus();
}

function goToStep(step) {
  const steps = document.querySelectorAll('.onboarding-step');
  const dots   = document.querySelectorAll('.dot');

  steps.forEach(el => el.classList.remove('active'));
  dots.forEach(el => el.classList.remove('active'));

  document.querySelector(`.onboarding-step[data-step="${step}"]`).classList.add('active');
  document.querySelector(`.dot[data-goto="${step}"]`).classList.add('active');

  const backBtn = document.getElementById('ob-back');
  const nextBtn = document.getElementById('ob-next');

  backBtn.hidden = step === 1;
  nextBtn.textContent = step === TOTAL_STEPS ? 'Get Started' : 'Next';

  currentStep = step;
}

function closeOnboarding() {
  const backdrop = document.getElementById('onboarding-backdrop');
  backdrop.hidden = true;
  localStorage.setItem(ONBOARDING_KEY, '1');
}

document.getElementById('ob-next').addEventListener('click', () => {
  if (currentStep < TOTAL_STEPS) {
    goToStep(currentStep + 1);
  } else {
    closeOnboarding();
  }
});

document.getElementById('ob-back').addEventListener('click', () => {
  if (currentStep > 1) goToStep(currentStep - 1);
});

document.querySelectorAll('.dot').forEach(dot => {
  dot.addEventListener('click', () => {
    goToStep(parseInt(dot.dataset.goto, 10));
  });
});

// Close on backdrop click
document.getElementById('onboarding-backdrop').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeOnboarding();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeOnboarding();
});

// ─── INIT ─────────────────────────────────────────────────
renderAll();
initPasswordGate();
// initOnboarding() is called inside initPasswordGate() after successful auth
// (or immediately if already authenticated)
if (localStorage.getItem(AUTH_KEY) === '1') {
  initOnboarding();
}
