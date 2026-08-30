// ============================================================
//  Gloria Gu — personal site
//  1. Mobile nav        2. Footer year       3. Reveal on scroll
//  4. EN / 中 language switch
//  5. Mentora interactive prototype (all its copy lives in MENTORA below)
// ============================================================

// ----- Mobile nav toggle -----
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ----- Footer year -----
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ----- Reveal-on-scroll -----
const revealTargets = document.querySelectorAll(
  '.hero-text, .hero-portrait, .section-head, .about-body, .about-aside, .exp-card, .mi-block, .principle, .project, .post, .contact-list li'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}

// ============================================================
//  4. Language switch  (EN / 中)
//  Page copy lives in the HTML as pairs of .i18n.en / .i18n.zh
//  elements; CSS hides the inactive one. This only flips a flag.
// ============================================================
const LANG_KEY = 'gg-lang';
const root = document.documentElement;

function currentLang() {
  return root.dataset.lang === 'zh' ? 'zh' : 'en';
}

function setLang(lang) {
  const next = lang === 'zh' ? 'zh' : 'en';
  root.dataset.lang = next;
  root.lang = next === 'zh' ? 'zh-Hans' : 'en';

  document.querySelectorAll('[data-set-lang]').forEach((btn) => {
    const on = btn.dataset.setLang === next;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  // SVG <text> can't use the CSS pair trick — swap it directly.
  document.querySelectorAll('[data-en][data-zh]').forEach((el) => {
    el.textContent = next === 'zh' ? el.dataset.zh : el.dataset.en;
  });

  try {
    localStorage.setItem(LANG_KEY, next);
  } catch (e) {
    /* private mode — fine, the choice just won't persist */
  }

  if (typeof renderProto === 'function' && document.getElementById('mentora-proto')) {
    renderProto();
  }
}

document.querySelectorAll('[data-set-lang]').forEach((btn) => {
  btn.addEventListener('click', () => setLang(btn.dataset.setLang));
});

// The saved language is applied at the very bottom of this file — setLang()
// re-renders the prototype, so everything it touches has to exist first.

// ============================================================
//  5. Mentora — interactive concept prototype
//  ⚠️ Everything here is SIMULATED. No real student data, no
//  pilot results. To change the wording, edit MENTORA below.
// ============================================================

// The exam question and the student's answer stay in English in both
// language modes — it is an English-medium A-Level paper, and translating
// it would misrepresent what the agent actually reads.
const QUESTION =
  'Q4 (a) State <strong>three</strong> benefits to a school of storing student records in a centralised relational database. <span class="marks">[3]</span>';

const ANSWER_LINES = [
  { id: 'a1', text: 'All the teachers can see the same data so it is not different in two places.' },
  { id: 'a2', text: 'It is safer.' },
  { id: 'a3', text: 'You can search for a student quickly.' }
];

const MARK_POINTS = [
  {
    id: 'mp1',
    code: 'MP1',
    status: 'awarded',
    text: { en: 'Single source of data — avoids inconsistent duplicate records', zh: '数据单一来源——避免重复记录不一致' },
    evidence: 'a1'
  },
  {
    id: 'mp2',
    code: 'MP2',
    status: 'not-awarded',
    text: { en: 'Access rights / permissions can be set for different users', zh: '可为不同用户设置访问权限' },
    evidence: null,
    why: {
      en: 'No sentence in the answer names a security mechanism. “It is safer” is an outcome, not a benefit the mark scheme can credit.',
      zh: '答案里没有任何一句指明安全机制。“It is safer” 说的是结果，不是 mark scheme 能给分的具体好处。'
    }
  },
  {
    id: 'mp3',
    code: 'MP3',
    status: 'awarded',
    text: { en: 'Records can be searched and queried quickly', zh: '记录可被快速检索与查询' },
    evidence: 'a3'
  }
];

const CAUSES = [
  {
    id: 'concept',
    label: { en: 'Concept gap', zh: '概念不清' },
    def: { en: 'The student does not know the concept exists.', zh: '学生根本不知道这个概念的存在。' },
    next: { en: 'Follow-up: re-teach the concept from scratch.', zh: '后续处理：从头重讲这个概念。' }
  },
  {
    id: 'reading',
    label: { en: 'Misread the question', zh: '审题失误' },
    def: { en: 'The knowledge is there, but answered a different question.', zh: '知识点掌握了，但答的是另一个问题。' },
    next: { en: 'Follow-up: command-word drill.', zh: '后续处理：命令词专项训练。' }
  },
  {
    id: 'vague',
    label: { en: 'Vague wording', zh: '表述笼统' },
    def: {
      en: 'The student is pointing at the right idea but never names the mechanism the mark scheme asks for.',
      zh: '学生指向了正确的方向，但没有说出 mark scheme 要的那个具体机制。'
    },
    next: {
      en: 'Follow-up: exam-phrasing practice — not re-teaching. Getting this distinction wrong wastes a week of lesson time.',
      zh: '后续处理：应试表述训练，而不是重讲概念。这一步判错，会白白浪费一周课时。'
    }
  },
  {
    id: 'calc',
    label: { en: 'Calculation slip', zh: '计算错误' },
    def: { en: 'Method correct, arithmetic wrong.', zh: '方法对，算错了。' },
    next: { en: 'Follow-up: no re-teaching needed.', zh: '后续处理：不需要重讲。' }
  },
  {
    id: 'omission',
    label: { en: 'Omission', zh: '遗漏' },
    def: { en: 'Fewer points given than the tariff asks for.', zh: '给出的点数少于题目分值要求。' },
    next: { en: 'Follow-up: answer-planning habit.', zh: '后续处理：答题规划习惯训练。' }
  }
];

const MASTERY = [
  { week: 'W1', v: 0.62 },
  { week: 'W2', v: 0.55 },
  { week: 'W3', v: 0.47 },
  { week: 'W4', v: 0.38 }
];
const THRESHOLD = 0.5;

const REVIEW_ITEMS = [
  {
    id: 'grade',
    label: { en: 'Grade: 2 / 3 — MP2 not awarded', zh: '评分：2 / 3 —— MP2 未得分' }
  },
  {
    id: 'attribution',
    label: { en: 'Cause: vague wording, not a concept gap', zh: '错因：表述笼统，而非概念不清' }
  },
  {
    id: 'practice',
    label: { en: 'Practice: two questions on access rights', zh: '练习：两道访问权限相关题目' }
  }
];

// ---------- prototype state ----------
const proto = document.getElementById('mentora-proto');
let state = null;

function freshState() {
  return {
    step: 0,
    evidence: 'mp1',
    cause: 'vague',
    openNodes: { unit2: true, sec23: true },
    tab5: 'practice',
    reviews: { grade: null, attribution: null, practice: null }
  };
}

function t(obj) {
  return obj[currentLang()] || obj.en;
}

const STEPS = [
  {
    n: '01',
    tab: { en: 'Capture', zh: '拍照上传' },
    title: { en: 'Capture &amp; structure', zh: '拍照上传与结构化' },
    human: { en: 'No teacher input', zh: '无需教师操作' },
    body: renderStep1
  },
  {
    n: '02',
    tab: { en: 'Grade', zh: '逐点批改' },
    title: { en: 'Grade against the mark scheme', zh: '按 mark scheme 逐点批改' },
    human: { en: 'No teacher input', zh: '无需教师操作' },
    body: renderStep2
  },
  {
    n: '03',
    tab: { en: 'Attribute', zh: '错因归因' },
    title: { en: 'Why the mark was lost', zh: '为什么会失这一分' },
    human: { en: 'No teacher input', zh: '无需教师操作' },
    body: renderStep3
  },
  {
    n: '04',
    tab: { en: 'Map', zh: '知识点定位' },
    title: { en: 'Map it to the syllabus', zh: '挂到大纲知识点上' },
    human: { en: 'No teacher input', zh: '无需教师操作' },
    body: renderStep4
  },
  {
    n: '05',
    tab: { en: 'Practice &amp; alert', zh: '练习与预警' },
    title: { en: 'Targeted practice, and who is slipping', zh: '针对性练习，以及谁在掉队' },
    human: { en: 'No teacher input', zh: '无需教师操作' },
    body: renderStep5
  },
  {
    n: '06',
    tab: { en: 'Review', zh: '教师审核' },
    title: { en: 'The teacher decides', zh: '教师做决定' },
    human: { en: '✋ The one human node', zh: '✋ 唯一的人工节点' },
    body: renderStep6
  },
  {
    n: '07',
    tab: { en: 'Release', zh: '一键下发' },
    title: { en: 'Release, and remember', zh: '下发，并记住' },
    human: { en: 'One click', zh: '点一下' },
    body: renderStep7
  }
];

// ---------- step renderers ----------

function answerBlock(highlightId, dim) {
  return `
    <div class="answer-sheet">
      <div class="sheet-label">${t({ en: "Student's answer", zh: '学生作答' })}</div>
      ${ANSWER_LINES.map(
        (l) =>
          `<p class="ans-line ${highlightId === l.id ? 'is-evidence' : ''} ${
            dim && highlightId !== l.id ? 'is-dim' : ''
          }" data-line="${l.id}"><span class="ans-num">${l.id.slice(1)}</span>${l.text}</p>`
      ).join('')}
    </div>`;
}

function renderStep1() {
  return `
    <p class="panel-lede">${t({
      en: 'A photo of handwritten work goes in. A multimodal model reads it, splits it by question number and returns text — <strong>every line stays editable</strong>, because an OCR error must never travel downstream into the grade.',
      zh: '输入是一张手写作业照片。多模态模型直接读图、按题号切分、输出文本——<strong>每一行都保持可编辑</strong>，因为识别错误绝不能一路传到分数上。'
    })}</p>

    <div class="panel-cols">
      <div class="photo-stub">
        <div class="photo-frame">
          <span class="photo-icon">🖼️</span>
          <span class="photo-name">IMG_2417.jpg</span>
          <span class="photo-meta">A-Level IT · Paper 1 · Q4(a)</span>
        </div>
      </div>
      <div>
        <div class="q-card">
          <span class="q-tag">${t({ en: 'Question detected', zh: '识别到的题目' })}</span>
          <p>${QUESTION}</p>
        </div>
        <div class="answer-sheet is-editable">
          <div class="sheet-label">${t({ en: 'Extracted text — click to edit', zh: '识别文本 —— 可点击编辑' })}</div>
          ${ANSWER_LINES.map(
            (l) =>
              `<p class="ans-line" contenteditable="true" spellcheck="false"><span class="ans-num" contenteditable="false">${l.id.slice(
                1
              )}</span>${l.text}</p>`
          ).join('')}
        </div>
      </div>
    </div>`;
}

function renderStep2() {
  const mp = MARK_POINTS.find((m) => m.id === state.evidence);
  const highlight = mp ? mp.evidence : null;
  const awarded = MARK_POINTS.filter((m) => m.status === 'awarded').length;

  return `
    <p class="panel-lede">${t({
      en: 'Each mark point is judged on its own, and the model must quote the sentence that justifies it. Click a mark point to see its evidence.',
      zh: '每个评分点单独判定，并且必须引用作为依据的那句话。点击任一评分点，查看它的依据。'
    })}</p>

    <div class="panel-cols">
      <div class="mp-list">
        ${MARK_POINTS.map(
          (m) => `
          <button type="button" class="mp ${m.status} ${state.evidence === m.id ? 'is-open' : ''}" data-mp="${m.id}">
            <span class="mp-code">${m.code}</span>
            <span class="mp-text">${t(m.text)}</span>
            <span class="mp-mark">${m.status === 'awarded' ? '✓ 1' : '✗ 0'}</span>
          </button>`
        ).join('')}
        <div class="mp-total">
          <span>${t({ en: 'Total', zh: '总分' })}</span>
          <strong>${awarded} / 3</strong>
        </div>
        <p class="micro">${t({
          en: 'The total is added up <em>outside</em> the model. LLM arithmetic is a known failure point — never let it do the sum.',
          zh: '总分在模型<em>之外</em>计算。LLM 的算术不可靠是已知失效点——绝不让它自己加总。'
        })}</p>
      </div>

      <div>
        ${answerBlock(highlight, true)}
        <div class="evidence-note ${mp && !mp.evidence ? 'is-warn' : ''}">
          ${
            mp && mp.evidence
              ? t({ en: 'Evidence found — highlighted on the left.', zh: '已找到依据——左侧高亮显示。' })
              : mp
              ? `<strong>${t({ en: 'No evidence found.', zh: '未找到依据。' })}</strong> ${t(mp.why)}`
              : t({ en: 'Select a mark point.', zh: '请选择一个评分点。' })
          }
        </div>
      </div>
    </div>`;
}

function renderStep3() {
  const c = CAUSES.find((x) => x.id === state.cause) || CAUSES[2];
  return `
    <p class="panel-lede">${t({
      en: 'A lost mark is not a diagnosis. MP2 was classified as <strong>vague wording</strong> — the student clearly knows security matters, but never names the mechanism. Click any cause to see how the follow-up would differ.',
      zh: '失分本身不是诊断。MP2 被归类为<strong>表述笼统</strong>——学生显然知道安全很重要，却没说出具体机制。点击任一错因，看后续处理有何不同。'
    })}</p>

    <div class="cause-chips">
      ${CAUSES.map(
        (x) =>
          `<button type="button" class="chip ${state.cause === x.id ? 'is-active' : ''} ${
            x.id === 'vague' ? 'is-detected' : ''
          }" data-cause="${x.id}">${t(x.label)}${x.id === 'vague' ? ' ●' : ''}</button>`
      ).join('')}
    </div>

    <div class="cause-detail">
      <h4>${t(c.label)}</h4>
      <p>${t(c.def)}</p>
      <p class="cause-next">${t(c.next)}</p>
      ${
        state.cause === 'vague'
          ? `<div class="detected-flag">${t({
              en: '● This is what the agent detected for MP2.',
              zh: '● 这是 Agent 对 MP2 的判定结果。'
            })}</div>`
          : ''
      }
    </div>

    ${answerBlock('a2', true)}`;
}

function renderStep4() {
  const o = state.openNodes;
  return `
    <p class="panel-lede">${t({
      en: 'The error is attached to one node of the syllabus tree. The tree is built by hand from the specification — the dirtiest step in the whole project, and the one that makes everything after it possible.',
      zh: '错误被挂到大纲知识点树的某个节点上。这棵树是照着考纲手工拆的——全项目最脏最累的一步，也是后面一切得以成立的前提。'
    })}</p>

    <div class="tree">
      <div class="tree-node root">A-Level Information Technology</div>
      <div class="tree-branch">
        <button type="button" class="tree-node branch ${o.unit2 ? 'is-open' : ''}" data-node="unit2">
          <span class="caret">${o.unit2 ? '▾' : '▸'}</span> Unit 2 · Data and databases
        </button>
        ${
          o.unit2
            ? `
        <div class="tree-branch">
          <div class="tree-node leaf muted">2.1 &nbsp;Relational structures</div>
          <div class="tree-node leaf muted">2.2 &nbsp;Querying data</div>
          <button type="button" class="tree-node branch on-path ${o.sec23 ? 'is-open' : ''}" data-node="sec23">
            <span class="caret">${o.sec23 ? '▾' : '▸'}</span> 2.3 &nbsp;Database security
          </button>
          ${
            o.sec23
              ? `
          <div class="tree-branch">
            <div class="tree-node leaf target">2.3.1 &nbsp;Access rights and user permissions
              <span class="target-tag">${t({ en: 'error mapped here', zh: '错误挂载于此' })}</span>
            </div>
            <div class="tree-node leaf muted">2.3.2 &nbsp;Encryption</div>
            <div class="tree-node leaf muted">2.3.3 &nbsp;Backup and recovery</div>
          </div>`
              : ''
          }
        </div>`
            : ''
        }
      </div>
    </div>

    <p class="micro">${t({
      en: 'Because the error has an address, the next steps can be automatic: practice is generated for <em>2.3.1</em>, and the mastery profile updates <em>2.3.1</em> — not a vague “database topic”.',
      zh: '因为错误有了地址，后面几步才能自动化：练习针对 <em>2.3.1</em> 生成，掌握画像更新的也是 <em>2.3.1</em>——而不是笼统的「数据库那块」。'
    })}</p>`;
}

function sparkline() {
  const x = (i) => 24 + i * 72;
  const y = (v) => 62 - ((v - 0.2) / 0.6) * 52;
  const pts = MASTERY.map((m, i) => `${x(i)},${y(m.v).toFixed(1)}`).join(' ');
  return `
    <svg class="spark" viewBox="0 0 264 86" role="img" aria-label="Mastery of 2.3.1 declining over four weeks">
      <line class="spark-thr" x1="14" y1="${y(THRESHOLD)}" x2="250" y2="${y(THRESHOLD)}" />
      <text class="spark-thrlab" x="252" y="${y(THRESHOLD) + 3}">${THRESHOLD.toFixed(1)}</text>
      <polyline class="spark-line" points="${pts}" />
      ${MASTERY.map(
        (m, i) =>
          `<circle class="spark-dot ${m.v < THRESHOLD ? 'is-low' : ''}" cx="${x(i)}" cy="${y(m.v).toFixed(
            1
          )}" r="4" /><text class="spark-lab" x="${x(i)}" y="80" text-anchor="middle">${m.week}</text>`
      ).join('')}
    </svg>`;
}

function renderStep5() {
  const isPractice = state.tab5 === 'practice';
  return `
    <p class="panel-lede">${t({
      en: 'Two things fall out of a mapped error: the next question to set, and the question of whether this is becoming a pattern.',
      zh: '一个被定位的错误会产出两样东西：下一道该出的题，以及——这是不是正在变成一种趋势。'
    })}</p>

    <div class="tabs" role="tablist">
      <button type="button" class="tab ${isPractice ? 'is-active' : ''}" data-tab5="practice" role="tab" aria-selected="${isPractice}">${t(
    { en: 'Generated practice', zh: '生成的练习' }
  )}</button>
      <button type="button" class="tab ${!isPractice ? 'is-active' : ''}" data-tab5="alert" role="tab" aria-selected="${!isPractice}">${t(
    { en: 'Risk alert', zh: '风险预警' }
  )}</button>
    </div>

    ${
      isPractice
        ? `
    <div class="practice">
      <div class="pq">
        <span class="pq-tag">2.3.1</span>
        <p>State <strong>two</strong> ways a school can restrict which staff are able to view a student's medical record. <span class="marks">[2]</span></p>
      </div>
      <div class="pq">
        <span class="pq-tag">2.3.1</span>
        <p>Explain <strong>one</strong> difference between read-only and read-write access rights. <span class="marks">[2]</span></p>
      </div>
      <p class="micro">${t({
        en: 'Same command words and mark tariff as the point that was missed. Practice that changes the question type teaches something else.',
        zh: '与失分点使用相同的命令词与分值。换了题型的练习，练的就是另一件事了。'
      })}</p>
    </div>`
        : `
    <div class="alert-card">
      <div class="alert-head">
        <span class="alert-flag">⚠</span>
        <div>
          <strong>${t({ en: 'Student A', zh: '学生 A' })}</strong>
          <span class="alert-sub">${t({
            en: '2.3.1 Access rights · mastery falling for 3 consecutive weeks',
            zh: '2.3.1 访问权限 · 掌握度连续 3 周下降'
          })}</span>
        </div>
      </div>
      ${sparkline()}
      <div class="rule-box">
        <strong>${t({ en: 'Rule that fired:', zh: '触发的规则：' })}</strong>
        ${t({
          en: 'mastery below 0.50 for 3 consecutive weeks. The threshold is configurable per class, and the rule is always shown — a warning a teacher cannot interrogate is a warning they will learn to ignore.',
          zh: '掌握度连续 3 周低于 0.50。阈值按班级可配置，且规则始终可见——一条老师无法追问的预警，最后一定会被忽略。'
        })}
      </div>
      <p class="micro">${t({
        en: 'Names are pseudonymised here and in any research use; student work is de-identified before it is processed.',
        zh: '此处及任何研究用途中，学生姓名均为化名；学生作业在处理前完成脱敏。'
      })}</p>
    </div>`
    }`;
}

function renderStep6() {
  const done = Object.values(state.reviews).filter(Boolean).length;
  const tally = { accept: 0, edit: 0, override: 0 };
  Object.values(state.reviews).forEach((v) => {
    if (v) tally[v] += 1;
  });
  const labels = {
    accept: { en: 'Accept', zh: '采纳' },
    edit: { en: 'Edit', zh: '修改' },
    override: { en: 'Override', zh: '推翻' }
  };

  return `
    <p class="panel-lede">${t({
      en: 'Everything above ran without the teacher. This is the only step that cannot. Nothing reaches a student until a person decides — accept, edit, or throw it out.',
      zh: '以上所有步骤都不需要教师参与。只有这一步不行。在有人做出决定之前——采纳、修改，或者直接推翻——没有任何内容会到达学生。'
    })}</p>

    <div class="review-list">
      ${REVIEW_ITEMS.map(
        (it) => `
        <div class="review-item ${state.reviews[it.id] ? 'is-done' : ''}">
          <span class="ri-label">${t(it.label)}</span>
          <span class="ri-actions">
            ${['accept', 'edit', 'override']
              .map(
                (a) =>
                  `<button type="button" class="ri-btn ri-${a} ${
                    state.reviews[it.id] === a ? 'is-chosen' : ''
                  }" data-review="${it.id}" data-decision="${a}">${t(labels[a])}</button>`
              )
              .join('')}
          </span>
        </div>`
      ).join('')}
    </div>

    <div class="tally">
      <div class="tally-nums">
        <span><strong>${tally.accept}</strong> ${t(labels.accept)}</span>
        <span><strong>${tally.edit}</strong> ${t(labels.edit)}</span>
        <span><strong>${tally.override}</strong> ${t(labels.override)}</span>
        <span class="tally-done">${done} / ${REVIEW_ITEMS.length} ${t({ en: 'reviewed', zh: '已审核' })}</span>
      </div>
      <p class="micro">${t({
        en: 'Each of those clicks is also a research data point. Existing studies ask teachers whether they trust AI marking; a review log records what they actually did with it. That is the same design serving two purposes.',
        zh: '每一次点击同时也是一个研究数据点。现有研究问的是教师「信不信」AI 批改；而审核日志记录的是他们「实际怎么做」。同一个设计，服务两个目的。'
      })}</p>
    </div>`;
}

function renderStep7() {
  const done = Object.values(state.reviews).filter(Boolean).length;
  if (done < REVIEW_ITEMS.length) {
    return `
      <div class="blocked">
        <span class="blocked-icon">🔒</span>
        <h4>${t({ en: 'Nothing to release yet', zh: '暂时没有可下发的内容' })}</h4>
        <p>${t({
          en: `You have reviewed ${done} of ${REVIEW_ITEMS.length} items. The agent will not release un-reviewed output to a student — that is design principle 03, enforced rather than promised.`,
          zh: `你已审核 ${done} / ${REVIEW_ITEMS.length} 项。Agent 不会把未经审核的内容下发给学生——这是设计原则 03，用机制强制，而不是靠承诺。`
        })}</p>
        <button type="button" class="btn btn-primary btn-sm" data-goto="5">${t({
          en: '← Back to review',
          zh: '← 回到审核'
        })}</button>
      </div>`;
  }

  const tally = { accept: 0, edit: 0, override: 0 };
  Object.values(state.reviews).forEach((v) => {
    if (v) tally[v] += 1;
  });

  return `
    <p class="panel-lede">${t({
      en: 'One click sends the reviewed feedback and practice to the student — and writes the result back into a profile that will still be there next week.',
      zh: '一次点击，把审核过的反馈与练习发给学生——同时把结果写回一份下周依然存在的学生画像。'
    })}</p>

    <div class="panel-cols">
      <div class="release-card">
        <div class="rc-head">${t({ en: 'Feedback released to the student', zh: '下发给学生的反馈' })}</div>
        <p><strong>Q4(a) — 2 / 3</strong></p>
        <p>You correctly identified <em>one source of data</em> and <em>faster searching</em>. Your third point — “it is safer” — describes a result rather than a benefit the mark scheme can credit.</p>
        <p>The mark scheme wants the mechanism: <strong>access rights can be set for different users</strong>. Try the two questions attached, then re-write point 3 in one sentence.</p>
      </div>

      <div>
        <div class="memory-card">
          <div class="rc-head">${t({ en: 'Long-term memory updated', zh: '长期记忆已更新' })}</div>
          <div class="mem-row">
            <span>${t({ en: 'Student A', zh: '学生 A' })} · 2.3.1</span>
            <span class="mem-val">0.47 <span class="mem-arrow">→</span> <strong class="is-low">0.38</strong></span>
          </div>
          <p class="micro">${t({
            en: 'Next week the loop starts from this profile, not from zero. That is the difference between an agent and a chat window.',
            zh: '下一周，闭环从这份画像开始，而不是从零开始。这就是 Agent 与聊天窗口的区别。'
          })}</p>
        </div>

        <div class="session-log">
          <div class="rc-head">${t({ en: 'Your decisions this session', zh: '你本次的审核决策' })}</div>
          <div class="log-nums">
            <span><strong>${tally.accept}</strong> ${t({ en: 'accepted', zh: '采纳' })}</span>
            <span><strong>${tally.edit}</strong> ${t({ en: 'edited', zh: '修改' })}</span>
            <span><strong>${tally.override}</strong> ${t({ en: 'overridden', zh: '推翻' })}</span>
          </div>
        </div>

        <button type="button" class="btn btn-ghost btn-sm" data-restart>
          ${t({ en: '↺ Run the loop again', zh: '↺ 再走一遍闭环' })}
        </button>
      </div>
    </div>`;
}

// ---------- render + wiring ----------

function renderProto() {
  if (!proto) return;
  if (!state) state = freshState();

  const tabsEl = proto.querySelector('.proto-steps');
  const panelEl = proto.querySelector('.proto-panel');
  const progEl = proto.querySelector('.proto-progress');
  const step = STEPS[state.step];

  tabsEl.innerHTML = STEPS.map(
    (s, i) => `
    <button type="button" class="proto-step ${i === state.step ? 'is-current' : ''} ${
      i < state.step ? 'is-done' : ''
    }" data-step="${i}" role="tab" aria-selected="${i === state.step}">
      <span class="ps-n">${s.n}</span><span class="ps-t">${t(s.tab)}</span>
    </button>`
  ).join('');

  panelEl.innerHTML = `
    <div class="panel-head">
      <h4>${t(step.title)}</h4>
      <span class="panel-human ${state.step === 5 ? 'is-human' : ''}">${t(step.human)}</span>
    </div>
    ${step.body()}`;

  progEl.textContent = `${state.step + 1} / ${STEPS.length}`;
  proto.querySelector('[data-proto-prev]').disabled = state.step === 0;
  proto.querySelector('[data-proto-next]').disabled = state.step === STEPS.length - 1;
}

function goTo(i) {
  state.step = Math.max(0, Math.min(STEPS.length - 1, i));
  renderProto();
}

if (proto) {
  state = freshState();
  renderProto();

  proto.addEventListener('click', (e) => {
    const el = e.target.closest('button');
    if (!el) return;

    if (el.dataset.step !== undefined) return goTo(Number(el.dataset.step));
    if (el.dataset.goto !== undefined) return goTo(Number(el.dataset.goto));
    if (el.hasAttribute('data-proto-next')) return goTo(state.step + 1);
    if (el.hasAttribute('data-proto-prev')) return goTo(state.step - 1);
    if (el.dataset.mp) {
      state.evidence = state.evidence === el.dataset.mp ? null : el.dataset.mp;
      return renderProto();
    }
    if (el.dataset.cause) {
      state.cause = el.dataset.cause;
      return renderProto();
    }
    if (el.dataset.node) {
      state.openNodes[el.dataset.node] = !state.openNodes[el.dataset.node];
      return renderProto();
    }
    if (el.dataset.tab5) {
      state.tab5 = el.dataset.tab5;
      return renderProto();
    }
    if (el.dataset.review) {
      state.reviews[el.dataset.review] = el.dataset.decision;
      return renderProto();
    }
    if (el.hasAttribute('data-restart')) {
      state = freshState();
      return renderProto();
    }
  });

  proto.addEventListener('keydown', (e) => {
    if (e.target.isContentEditable) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(state.step + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(state.step - 1);
    }
  });
}

// ---- finally: restore the saved language ----
let savedLang = null;
try {
  savedLang = localStorage.getItem(LANG_KEY);
} catch (e) {
  /* private mode — fall through to English */
}
if (savedLang && savedLang !== currentLang()) setLang(savedLang);
