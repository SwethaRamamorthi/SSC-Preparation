/**
 * SWETHA'S SSC CGL COMMAND CENTER - MASTER APPLICATION LOGIC
 * Features: SPA Navigation, Target Countdown, Exam Player, PYQ & Mock Engines,
 * Mistake Book, Bookmarks, Adaptive Recommendations, Question Importer & LocalStorage Persistence.
 */

// Global Application State Object
const AppState = {
  questions: [],
  pyqPapers: [],
  userAttempts: {},      // { qId: { answer: idx, isCorrect: bool, date: string } }
  mistakes: [],          // array of qIds
  bookmarks: [],         // array of qIds
  mockHistory: [],       // array of finished mock test records
  dailyCompleted: {},    // { YYYY-MM-DD: score }
  streak: { count: 7, lastDate: null },
  activeTest: null,      // active exam/practice state for timer & palette
  checklist: [
    { id: 1, text: "30 Quant questions (Percentage & Profit/Loss)", done: false },
    { id: 2, text: "25 Reasoning questions (Coding & Syllogism)", done: false },
    { id: 3, text: "20 English questions (Synonyms & Error Detection)", done: false },
    { id: 4, text: "25 GA questions (Polity & Science)", done: false },
    { id: 5, text: "Review Mistakes in Mistake Book", done: false }
  ]
};

// Target Examination Date: 14 October 2026
const TARGET_DATE = new Date("October 14, 2026 00:00:00").getTime();

// Initialize App on DOM Loaded
document.addEventListener("DOMContentLoaded", () => {
  initSplashScreen();
  initLocalStorage();
  loadAllQuestionData();
  startCountdownTimer();
  updateGreeting();
  setupNavigation();
  setupEventListeners();
  renderCurrentView();
  updateDashboardMetrics();
  updateStreakDisplay();
  checkAdaptiveRecommendations();
});

function initSplashScreen() {
  const splash = document.getElementById("splash-screen");
  const statusEl = document.getElementById("splash-status");

  if (!splash) return;

  setTimeout(() => {
    if (statusEl) statusEl.textContent = "Preparing 2,100+ Question Database...";
  }, 600);

  setTimeout(() => {
    if (statusEl) statusEl.textContent = "Ready! Wishing you Victory, Swetha! 🎯";
  }, 1500);

  setTimeout(() => {
    splash.classList.add("hidden");
  }, 2200);
}

/* ==========================================================================
   1. DATA & LOCALSTORAGE INITIALIZATION
   ========================================================================== */

function initLocalStorage() {
  const attempts = localStorage.getItem("swetha_ssc_attempts");
  if (attempts) AppState.userAttempts = JSON.parse(attempts);

  const mistakes = localStorage.getItem("swetha_ssc_mistakes");
  if (mistakes) AppState.mistakes = JSON.parse(mistakes);

  const saved = localStorage.getItem("swetha_ssc_bookmarks");
  if (saved) AppState.bookmarks = JSON.parse(saved);

  const mocks = localStorage.getItem("swetha_ssc_mocks");
  if (mocks) AppState.mockHistory = JSON.parse(mocks);

  const streak = localStorage.getItem("swetha_ssc_streak");
  if (streak) AppState.streak = JSON.parse(streak);

  const theme = localStorage.getItem("swetha_ssc_theme") || "dark";
  document.body.setAttribute("data-theme", theme);

  const checklist = localStorage.getItem("swetha_ssc_checklist");
  if (checklist) AppState.checklist = JSON.parse(checklist);

  // Restore unfinished active test if browser was refreshed
  const activeTestBackup = localStorage.getItem("swetha_ssc_active_test");
  if (activeTestBackup) {
    try {
      AppState.activeTest = JSON.parse(activeTestBackup);
    } catch(e) {
      localStorage.removeItem("swetha_ssc_active_test");
    }
  }
}

function saveState(key) {
  if (key === "attempts") localStorage.setItem("swetha_ssc_attempts", JSON.stringify(AppState.userAttempts));
  if (key === "mistakes") localStorage.setItem("swetha_ssc_mistakes", JSON.stringify(AppState.mistakes));
  if (key === "bookmarks") localStorage.setItem("swetha_ssc_bookmarks", JSON.stringify(AppState.bookmarks));
  if (key === "mocks") localStorage.setItem("swetha_ssc_mocks", JSON.stringify(AppState.mockHistory));
  if (key === "streak") localStorage.setItem("swetha_ssc_streak", JSON.stringify(AppState.streak));
  if (key === "checklist") localStorage.setItem("swetha_ssc_checklist", JSON.stringify(AppState.checklist));
  if (key === "activeTest") {
    if (AppState.activeTest) localStorage.setItem("swetha_ssc_active_test", JSON.stringify(AppState.activeTest));
    else localStorage.removeItem("swetha_ssc_active_test");
  }
}

function loadAllQuestionData() {
  let combined = [];

  if (window.REASONING_QUESTIONS) combined = combined.concat(window.REASONING_QUESTIONS);
  if (window.QUANTITATIVE_QUESTIONS) combined = combined.concat(window.QUANTITATIVE_QUESTIONS);
  if (window.ENGLISH_QUESTIONS) combined = combined.concat(window.ENGLISH_QUESTIONS);
  if (window.GA_QUESTIONS) combined = combined.concat(window.GA_QUESTIONS);
  if (window.EXCEL_QUESTIONS) combined = combined.concat(window.EXCEL_QUESTIONS);

  // Custom imported questions from LocalStorage
  const customQuestions = localStorage.getItem("swetha_ssc_custom_questions");
  if (customQuestions) {
    try {
      const parsed = JSON.parse(customQuestions);
      combined = combined.concat(parsed);
    } catch(e) { console.error("Error loading custom questions", e); }
  }

  AppState.questions = combined;

  if (window.PREVIOUS_YEARS_PAPERS) {
    AppState.pyqPapers = window.PREVIOUS_YEARS_PAPERS;
  }
}

/* ==========================================================================
   2. COUNTDOWN TIMER & GREETING
   ========================================================================== */

function startCountdownTimer() {
  function update() {
    const now = new Date().getTime();
    const distance = TARGET_DATE - now;

    const daysEl = document.getElementById("timer-days");
    const hoursEl = document.getElementById("timer-hours");
    const minsEl = document.getElementById("timer-mins");
    const secsEl = document.getElementById("timer-secs");
    const targetStatusEl = document.getElementById("countdown-status-text");

    if (distance < 0) {
      if (targetStatusEl) targetStatusEl.textContent = "THE DAY HAS ARRIVED. GIVE IT YOUR BEST!";
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minsEl) minsEl.textContent = "00";
      if (secsEl) secsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, "0");
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, "0");

    // Sprint calculation on study plan view
    const sprintDaysEl = document.getElementById("sprint-days-count");
    if (sprintDaysEl) sprintDaysEl.textContent = days;
  }

  update();
  setInterval(update, 1000);
}

function updateGreeting() {
  const hour = new Date().getHours();
  let timeStr = "Good Morning";
  if (hour >= 12 && hour < 17) timeStr = "Good Afternoon";
  else if (hour >= 17) timeStr = "Good Evening";

  const greetingEl = document.getElementById("greeting-text");
  if (greetingEl) greetingEl.textContent = `${timeStr}, Swetha 👋`;
}

/* ==========================================================================
   3. SPA ROUTING & NAVIGATION
   ========================================================================== */

function setupNavigation() {
  window.addEventListener("hashchange", () => {
    renderCurrentView();
    // Auto close mobile sidebar on navigation change
    const sidebar = document.querySelector(".sidebar");
    if (sidebar && window.innerWidth <= 1024) {
      sidebar.classList.remove("open");
      removeSidebarBackdrop();
    }
  });

  // Mobile sidebar toggle
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const sidebar = document.querySelector(".sidebar");
  if (mobileBtn && sidebar) {
    mobileBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      if (sidebar.classList.contains("open")) {
        createSidebarBackdrop();
      } else {
        removeSidebarBackdrop();
      }
    });
  }

  // Auto-close sidebar when clicking any sidebar link
  document.querySelectorAll(".sidebar .nav-item").forEach(link => {
    link.addEventListener("click", () => {
      if (sidebar && window.innerWidth <= 1024) {
        sidebar.classList.remove("open");
        removeSidebarBackdrop();
      }
    });
  });
}

function createSidebarBackdrop() {
  let backdrop = document.getElementById("sidebar-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "sidebar-backdrop";
    backdrop.className = "sidebar-backdrop";
    document.body.appendChild(backdrop);
    backdrop.addEventListener("click", () => {
      const sidebar = document.querySelector(".sidebar");
      if (sidebar) sidebar.classList.remove("open");
      removeSidebarBackdrop();
    });
  }
  backdrop.classList.add("active");
}

function removeSidebarBackdrop() {
  const backdrop = document.getElementById("sidebar-backdrop");
  if (backdrop) backdrop.classList.remove("active");
}

let quoteIndex = 0;
let quoteTimer = null;

const MOTIVATION_QUOTES = [
  { quote: "Swetha, today's small progress becomes tomorrow's confidence.", author: "Daily Prep Goal" },
  { quote: "Don't chase perfection. Chase one more correct answer.", author: "Exam Strategy" },
  { quote: "Your preparation is being built question by question.", author: "Consistency Motto" },
  { quote: "14 October 2026 is not just a date. It is your target date.", author: "Target Mission" },
  { quote: "One Question At A Time. One Day At A Time. One Goal At A Time.", author: "Swetha's Personal Motto" },
  { quote: "May Lord Murugan's wisdom and Vel guide you to victory!", author: "Divine Blessing" }
];

function renderMotivationQuote() {
  displayQuoteAtIndex(quoteIndex);

  if (quoteTimer) clearInterval(quoteTimer);
  quoteTimer = setInterval(() => {
    quoteIndex = (quoteIndex + 1) % MOTIVATION_QUOTES.length;
    displayQuoteAtIndex(quoteIndex);
  }, 5000);
}

function displayQuoteAtIndex(idx) {
  const quoteEl = document.getElementById("daily-motivation-quote");
  const authorEl = document.getElementById("daily-motivation-author");
  if (!quoteEl) return;

  const item = MOTIVATION_QUOTES[idx];
  quoteEl.style.opacity = "0";
  quoteEl.style.transform = "translateY(5px)";

  setTimeout(() => {
    quoteEl.textContent = `"${item.quote}"`;
    if (authorEl) authorEl.textContent = `— ${item.author}`;
    quoteEl.style.opacity = "1";
    quoteEl.style.transform = "translateY(0)";
  }, 200);
}

function nextMotivationQuote() {
  quoteIndex = (quoteIndex + 1) % MOTIVATION_QUOTES.length;
  displayQuoteAtIndex(quoteIndex);
}

function renderCurrentView() {
  const hash = window.location.hash || "#dashboard";
  const viewId = hash.replace("#", "");

  // Update active nav links
  document.querySelectorAll(".nav-item, .mobile-nav-item").forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === hash) {
      link.classList.add("active");
    }
  });

  // Hide all view sections
  document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));

  // Find target view section
  const targetView = document.getElementById(`view-${viewId}`) || document.getElementById("view-dashboard");
  if (targetView) targetView.classList.add("active");

  // Specific render handlers for views
  if (viewId === "pyq") renderPYQView();
  else if (viewId === "practice") renderPracticeView();
  else if (viewId === "mock-test") renderMockTestView();
  else if (viewId === "mistakes") renderMistakeBookView();
  else if (viewId === "saved") renderSavedQuestionsView();
  else if (viewId === "progress") renderProgressView();
  else if (viewId === "daily") renderDailyChallengeView();
  else if (viewId === "sprint") renderStudyPlanView();
  else if (viewId === "shortcuts") renderShortcutsView();
  else if (viewId === "flashcards") renderFlashcardsView();
  else renderDashboardView();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==========================================================================
   4. DASHBOARD VIEW RENDER & METRICS
   ========================================================================== */

function renderDashboardView() {
  updateDashboardMetrics();
  renderChecklist();
  renderMotivationQuote();
}

function updateDashboardMetrics() {
  const attemptsKeys = Object.keys(AppState.userAttempts);
  const totalAttempted = attemptsKeys.length;

  let correctCount = 0;
  attemptsKeys.forEach(qId => {
    if (AppState.userAttempts[qId].isCorrect) correctCount++;
  });

  const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

  const attemptedEl = document.getElementById("dash-attempted");
  const accuracyEl = document.getElementById("dash-accuracy");
  const streakEl = document.getElementById("dash-streak");
  const mistakesCountEl = document.getElementById("dash-mistakes-count");

  if (attemptedEl) attemptedEl.textContent = totalAttempted;
  if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;
  if (streakEl) streakEl.textContent = `🔥 ${AppState.streak.count}`;
  if (mistakesCountEl) mistakesCountEl.textContent = AppState.mistakes.length;

  // Subject Progress Calculation
  const subjects = [
    { name: "General Intelligence & Reasoning", key: "reasoning", barId: "bar-reasoning", textId: "txt-reasoning" },
    { name: "Quantitative Aptitude", key: "quant", barId: "bar-quant", textId: "txt-quant" },
    { name: "English Comprehension", key: "english", barId: "bar-english", textId: "txt-english" },
    { name: "General Awareness", key: "ga", barId: "bar-ga", textId: "txt-ga" }
  ];

  subjects.forEach(sub => {
    const subQuestions = AppState.questions.filter(q => q.subject === sub.name);
    const subTotal = subQuestions.length;
    let subAttempted = 0;
    let subCorrect = 0;

    subQuestions.forEach(q => {
      if (AppState.userAttempts[q.id]) {
        subAttempted++;
        if (AppState.userAttempts[q.id].isCorrect) subCorrect++;
      }
    });

    const subAcc = subAttempted > 0 ? Math.round((subCorrect / subAttempted) * 100) : 0;
    const bar = document.getElementById(sub.barId);
    const txt = document.getElementById(sub.textId);

    if (bar) bar.style.width = `${subAcc}%`;
    if (txt) txt.textContent = `${subAcc}% (${subCorrect}/${subAttempted})`;
  });
}

function renderChecklist() {
  const container = document.getElementById("dashboard-checklist");
  if (!container) return;

  container.innerHTML = AppState.checklist.map(item => `
    <div class="checklist-item ${item.done ? 'completed' : ''}">
      <input type="checkbox" id="check-${item.id}" ${item.done ? 'checked' : ''} onchange="toggleChecklistItem(${item.id})">
      <label for="check-${item.id}">${item.text}</label>
    </div>
  `).join("");
}

function toggleChecklistItem(id) {
  const item = AppState.checklist.find(i => i.id === id);
  if (item) {
    item.done = !item.done;
    saveState("checklist");
    renderChecklist();
  }
}

/* ==========================================================================
   5. PREVIOUS YEAR QUESTIONS (PYQ) ENGINE
   ========================================================================== */

function renderPYQView() {
  const grid = document.getElementById("pyq-cards-grid");
  if (!grid) return;

  const yearFilter = document.getElementById("pyq-year-filter")?.value || "all";
  const subjectFilter = document.getElementById("pyq-subject-filter")?.value || "all";

  let filtered = AppState.pyqPapers;
  if (yearFilter !== "all") filtered = filtered.filter(p => p.year.toString() === yearFilter);

  grid.innerHTML = filtered.map(paper => `
    <div class="card">
      <div class="card-icon">📜</div>
      <div class="badge badge-gold" style="margin-bottom:0.5rem; display:inline-block;">${paper.year} | ${paper.tier} | ${paper.shift}</div>
      <div class="card-title">${paper.title}</div>
      <div class="card-desc">${paper.description}</div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; font-size:0.85rem; color:var(--text-secondary);">
        <span>⏱️ ${paper.durationMinutes} Mins</span>
        <span>❓ ${paper.totalQuestions} Questions</span>
      </div>
      <button class="btn btn-primary btn-block" onclick="startPYQPaper('${paper.id}')">START PAPER</button>
    </div>
  `).join("");
}

function startPYQPaper(paperId) {
  const paper = AppState.pyqPapers.find(p => p.id === paperId);
  if (!paper) return;

  // Select questions belonging to paper year or random subset matching totalQuestions count
  let paperQuestions = AppState.questions.filter(q => q.year === paper.year && q.shift === paper.shift);
  if (paperQuestions.length === 0) {
    paperQuestions = AppState.questions.slice(0, paper.totalQuestions);
  }

  startQuizEngine(paper.title, paperQuestions, paper.durationMinutes * 60);
}

/* ==========================================================================
   6. SECTION-WISE TRAINING ARENA
   ========================================================================== */

function renderPracticeView() {
  // Setup dynamic topic dropdowns based on subject selection
  const subjectSelect = document.getElementById("practice-subject-select");
  if (subjectSelect) {
    subjectSelect.removeEventListener("change", updatePracticeTopics);
    subjectSelect.addEventListener("change", updatePracticeTopics);
    updatePracticeTopics();
  }
}

function updatePracticeTopics() {
  const subject = document.getElementById("practice-subject-select")?.value;
  const topicSelect = document.getElementById("practice-topic-select");
  if (!topicSelect) return;

  const topicsMap = {
    "General Intelligence & Reasoning": ["Analogy", "Coding-Decoding", "Series", "Blood Relations", "Syllogism", "Direction Sense", "Classification", "Mathematical Operations", "Ranking", "Venn Diagram"],
    "Quantitative Aptitude": ["Percentage", "Profit & Loss", "Ratio & Proportion", "Average", "Time & Work", "Simple Interest", "Compound Interest", "Time, Speed & Distance", "Algebra", "Geometry", "Mensuration", "Trigonometry", "Number System"],
    "English Comprehension": ["Synonyms", "Antonyms", "Idioms & Phrases", "One Word Substitution", "Error Detection", "Sentence Improvement", "Fill in the Blanks", "Active/Passive Voice", "Direct/Indirect Speech"],
    "General Awareness": ["Indian Polity", "History", "Geography", "General Science", "Economics", "Static GK", "Sports", "Important Days", "Books & Authors"]
  };

  const topics = topicsMap[subject] || [];
  topicSelect.innerHTML = `<option value="all">All Topics</option>` + topics.map(t => `<option value="${t}">${t}</option>`).join("");
}

function startTrainingSession() {
  const subject = document.getElementById("practice-subject-select")?.value;
  const topic = document.getElementById("practice-topic-select")?.value;
  const difficulty = document.getElementById("practice-difficulty-select")?.value;
  const count = parseInt(document.getElementById("practice-count-select")?.value || "10");

  let pool = AppState.questions.filter(q => q.subject === subject);
  if (topic !== "all") pool = pool.filter(q => q.topic === topic);
  if (difficulty !== "all") pool = pool.filter(q => q.difficulty === difficulty);

  if (pool.length === 0) {
    showToast("No questions found matching your filter criteria.", "warning");
    return;
  }

  const selected = pool.slice(0, count);
  startQuizEngine(`Training: ${subject} (${topic !== "all" ? topic : "All Topics"})`, selected, count * 90);
}

/* ==========================================================================
   7. MOCK TEST SYSTEM
   ========================================================================== */

function renderMockTestView() {
  const historyContainer = document.getElementById("mock-test-history");
  if (!historyContainer) return;

  if (AppState.mockHistory.length === 0) {
    historyContainer.innerHTML = `<p style="color:var(--text-secondary); text-align:center; padding:1.5rem;">No mock test history recorded yet. Complete your first test to see analytics!</p>`;
    return;
  }

  historyContainer.innerHTML = AppState.mockHistory.map((m, idx) => `
    <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:1rem; border-radius:var(--radius-md); margin-bottom:0.85rem; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <div style="font-weight:700; font-size:1rem; color:var(--text-primary);">Mock Test #${AppState.mockHistory.length - idx}</div>
        <div style="font-size:0.8rem; color:var(--text-secondary);">${m.date}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:1.1rem; font-weight:800; color:var(--accent-gold);">${m.score} / ${m.totalMarks} Marks</div>
        <div style="font-size:0.8rem; color:var(--success);">Accuracy: ${m.accuracy}%</div>
      </div>
    </div>
  `).join("");
}

function startFullMockTest() {
  // Tier I style: 100 questions (or max available), 60 minutes
  const selected = AppState.questions.slice(0, 100);
  startQuizEngine("SSC CGL Tier-I Official Mock Test", selected, 3600, true);
}

/* ==========================================================================
   8. MASTER EXAM / QUIZ PLAYER ENGINE
   ========================================================================== */

function startQuizEngine(title, questionsList, timeSeconds, isMock = false) {
  AppState.activeTest = {
    title,
    questions: questionsList,
    currentIndex: 0,
    userAnswers: {},     // qId -> optionIndex
    markedForReview: {}, // qId -> boolean
    timeRemaining: timeSeconds,
    totalTime: timeSeconds,
    isMock: isMock
  };

  saveState("activeTest");

  // Open Exam Player View
  window.location.hash = "#exam-player";
  renderExamPlayerView();
  startExamTimer();
}

function renderExamPlayerView() {
  const container = document.getElementById("view-exam-player");
  if (!container || !AppState.activeTest) return;

  container.classList.add("active");
  const test = AppState.activeTest;
  const currentQ = test.questions[test.currentIndex];
  const qId = currentQ.id;

  const isSaved = AppState.bookmarks.includes(qId);
  const isMarked = test.markedForReview[qId];
  const selectedOpt = test.userAnswers[qId];

  // Title Header
  document.getElementById("exam-player-title").textContent = test.title;

  // Question metadata
  document.getElementById("exam-q-number").textContent = `Question ${test.currentIndex + 1} of ${test.questions.length}`;
  document.getElementById("exam-q-subject").textContent = currentQ.subject;
  document.getElementById("exam-q-topic").textContent = currentQ.topic;
  document.getElementById("exam-q-source").textContent = `Source: ${currentQ.source || 'Practice'}`;

  // Bookmark Button
  const bmBtn = document.getElementById("exam-bookmark-btn");
  if (bmBtn) {
    bmBtn.className = `bookmark-btn ${isSaved ? 'saved' : ''}`;
    bmBtn.innerHTML = isSaved ? '★ Saved' : '☆ Save Question';
    bmBtn.onclick = () => toggleBookmark(qId);
  }

  // Question Text
  document.getElementById("exam-q-text").textContent = currentQ.question;

  // Options List
  const optionsList = document.getElementById("exam-options-list");
  const labels = ["A", "B", "C", "D"];
  optionsList.innerHTML = currentQ.options.map((opt, idx) => {
    let stateClass = "";
    if (selectedOpt === idx) stateClass = "selected";

    // If quiz submitted/submitted state, show correct/incorrect
    if (test.submitted) {
      if (idx === currentQ.answer) stateClass += " correct";
      else if (selectedOpt === idx && idx !== currentQ.answer) stateClass += " incorrect";
    }

    return `
      <div class="option-card ${stateClass}" onclick="selectQuizOption(${idx})">
        <div class="option-prefix">${labels[idx]}</div>
        <div class="option-text">${opt}</div>
      </div>
    `;
  }).join("");

  // Explanation Panel (Visible if test submitted or in practice mode review)
  const expPanel = document.getElementById("exam-explanation-panel");
  if (test.submitted || test.showExpl) {
    expPanel.style.display = "block";
    expPanel.innerHTML = `
      <div class="explanation-title">💡 Detailed Solution & Concept</div>
      <p style="margin-bottom:0.75rem; color:var(--text-primary); font-size:0.95rem;">${currentQ.explanation}</p>
      ${currentQ.shortcut ? `<div class="trick-box">⚡ <strong>Shortcut / Quick Trick:</strong> ${currentQ.shortcut}</div>` : ''}
    `;
  } else {
    expPanel.style.display = "none";
  }

  // Render Right Sidebar Question Palette Grid
  renderQuestionPalette();
}

function renderQuestionPalette() {
  const test = AppState.activeTest;
  if (!test) return;

  const paletteGrid = document.getElementById("exam-palette-grid");
  if (!paletteGrid) return;

  paletteGrid.innerHTML = test.questions.map((q, idx) => {
    let btnClass = "palette-btn";
    if (idx === test.currentIndex) btnClass += " current";

    const ans = test.userAnswers[q.id];
    const isMarked = test.markedForReview[q.id];

    if (test.submitted) {
      if (ans !== undefined) {
        if (ans === q.answer) btnClass += " correct";
        else btnClass += " wrong";
      }
    } else {
      if (isMarked) btnClass += " marked";
      else if (ans !== undefined) btnClass += " answered";
    }

    return `
      <button class="${btnClass}" onclick="jumpToQuestion(${idx})">${idx + 1}</button>
    `;
  }).join("");
}

function selectQuizOption(optIdx) {
  const test = AppState.activeTest;
  if (!test || test.submitted) return;

  const qId = test.questions[test.currentIndex].id;
  test.userAnswers[qId] = optIdx;
  saveState("activeTest");
  renderExamPlayerView();
}

function markForReview() {
  const test = AppState.activeTest;
  if (!test) return;

  const qId = test.questions[test.currentIndex].id;
  test.markedForReview[qId] = !test.markedForReview[qId];
  saveState("activeTest");
  renderExamPlayerView();
}

function nextQuestion() {
  const test = AppState.activeTest;
  if (!test) return;

  if (test.currentIndex < test.questions.length - 1) {
    test.currentIndex++;
    renderExamPlayerView();
  }
}

function prevQuestion() {
  const test = AppState.activeTest;
  if (!test) return;

  if (test.currentIndex > 0) {
    test.currentIndex--;
    renderExamPlayerView();
  }
}

function jumpToQuestion(idx) {
  const test = AppState.activeTest;
  if (!test) return;

  test.currentIndex = idx;
  renderExamPlayerView();
}

/* Exam Countdown Timer Logic */
let timerInterval = null;

function startExamTimer() {
  if (timerInterval) clearInterval(timerInterval);

  const display = document.getElementById("exam-timer-display");
  
  timerInterval = setInterval(() => {
    if (!AppState.activeTest || AppState.activeTest.submitted) {
      clearInterval(timerInterval);
      return;
    }

    AppState.activeTest.timeRemaining--;
    saveState("activeTest");

    if (AppState.activeTest.timeRemaining <= 0) {
      clearInterval(timerInterval);
      showToast("Time's up! Automatically submitting paper.", "warning");
      submitQuizTest();
      return;
    }

    const mins = Math.floor(AppState.activeTest.timeRemaining / 60);
    const secs = AppState.activeTest.timeRemaining % 60;
    if (display) display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, 1000);
}

/* Submit Quiz & Calculate Score */
function submitQuizTest() {
  const test = AppState.activeTest;
  if (!test || test.submitted) return;

  test.submitted = true;
  clearInterval(timerInterval);

  let correct = 0;
  let wrong = 0;
  let unattempted = 0;

  test.questions.forEach(q => {
    const userAns = test.userAnswers[q.id];
    if (userAns === undefined) {
      unattempted++;
    } else if (userAns === q.answer) {
      correct++;
      AppState.userAttempts[q.id] = { answer: userAns, isCorrect: true, date: new Date().toISOString() };
    } else {
      wrong++;
      AppState.userAttempts[q.id] = { answer: userAns, isCorrect: false, date: new Date().toISOString() };
      // Save to mistake book automatically
      if (!AppState.mistakes.includes(q.id)) {
        AppState.mistakes.push(q.id);
      }
    }
  });

  saveState("attempts");
  saveState("mistakes");

  // Calculate score (Tier-I style: +2 marks for correct, -0.50 for wrong)
  const totalMarks = test.questions.length * 2;
  const score = (correct * 2) - (wrong * 0.50);
  const accuracy = (correct + wrong) > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

  // Save mock test history if mock test
  if (test.isMock) {
    AppState.mockHistory.unshift({
      date: new Date().toLocaleDateString(),
      score: score,
      totalMarks: totalMarks,
      accuracy: accuracy,
      correct: correct,
      wrong: wrong,
      unattempted: unattempted
    });
    saveState("mocks");
  }

  // Show Result Modal
  showResultModal(score, totalMarks, correct, wrong, unattempted, accuracy);
  renderExamPlayerView();
}

function showResultModal(score, totalMarks, correct, wrong, unattempted, accuracy) {
  const modal = document.getElementById("quiz-result-modal");
  if (!modal) return;

  document.getElementById("res-score").textContent = `${score} / ${totalMarks}`;
  document.getElementById("res-correct").textContent = correct;
  document.getElementById("res-wrong").textContent = wrong;
  document.getElementById("res-unattempted").textContent = unattempted;
  document.getElementById("res-accuracy").textContent = `${accuracy}%`;

  modal.style.display = "flex";
}

function closeResultModal() {
  const modal = document.getElementById("quiz-result-modal");
  if (modal) modal.style.display = "none";
}

/* ==========================================================================
   9. MISTAKE BOOK ENGINE
   ========================================================================== */

function renderMistakeBookView() {
  const container = document.getElementById("mistakes-list-container");
  if (!container) return;

  if (AppState.mistakes.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:3rem; background:var(--bg-card); border-radius:var(--radius-lg); border:1px solid var(--border-color);">
        <div style="font-size:3rem; margin-bottom:1rem;">🎉</div>
        <h3 style="color:var(--text-primary); margin-bottom:0.5rem;">Mistake Book is Empty!</h3>
        <p style="color:var(--text-secondary);">Great job, Swetha! Any incorrectly answered questions in practice or mocks will automatically land here for your review.</p>
      </div>
    `;
    return;
  }

  const mistakeQuestions = AppState.questions.filter(q => AppState.mistakes.includes(q.id));

  container.innerHTML = `
    <div style="margin-bottom:1.5rem; display:flex; justify-content:space-between; align-items:center;">
      <span style="font-weight:700; color:var(--text-secondary);">${mistakeQuestions.length} Questions Saved in Mistake Book</span>
      <button class="btn btn-gold" onclick="retryAllMistakes()">🔁 Retry All Mistakes</button>
    </div>
  ` + mistakeQuestions.map((q, idx) => `
    <div class="card" style="margin-bottom:1.25rem;">
      <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem;">
        <span class="badge badge-purple">${q.subject} • ${q.topic}</span>
        <button class="btn btn-sm btn-secondary" onclick="removeFromMistakes('${q.id}')">❌ Remove</button>
      </div>
      <div style="font-weight:700; font-size:1.05rem; margin-bottom:1rem; color:var(--text-primary);">${idx + 1}. ${q.question}</div>
      <div style="background:rgba(16, 185, 129, 0.1); border-left:3px solid var(--success); padding:0.75rem 1rem; border-radius:4px; margin-bottom:0.75rem; font-size:0.9rem; color:var(--success);">
        ✔ <strong>Correct Answer:</strong> ${q.options[q.answer]}
      </div>
      <div style="background:rgba(0,0,0,0.3); padding:0.85rem; border-radius:var(--radius-sm); font-size:0.88rem; color:var(--text-secondary);">
        <strong>Explanation:</strong> ${q.explanation}
      </div>
    </div>
  `).join("");
}

function removeFromMistakes(qId) {
  AppState.mistakes = AppState.mistakes.filter(id => id !== qId);
  saveState("mistakes");
  showToast("Question removed from Mistake Book.", "success");
  renderMistakeBookView();
}

function retryAllMistakes() {
  const mistakeQuestions = AppState.questions.filter(q => AppState.mistakes.includes(q.id));
  if (mistakeQuestions.length === 0) return;

  startQuizEngine("Mistake Revision Re-Test", mistakeQuestions, mistakeQuestions.length * 90);
}

/* ==========================================================================
   10. BOOKMARKS / SAVED QUESTIONS
   ========================================================================== */

function toggleBookmark(qId) {
  if (AppState.bookmarks.includes(qId)) {
    AppState.bookmarks = AppState.bookmarks.filter(id => id !== qId);
    showToast("Removed from Saved Questions.", "info");
  } else {
    AppState.bookmarks.push(qId);
    showToast("Question saved to Bookmarks!", "success");
  }
  saveState("bookmarks");
  renderExamPlayerView();
}

function renderSavedQuestionsView() {
  const container = document.getElementById("saved-list-container");
  if (!container) return;

  if (AppState.bookmarks.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:3rem; background:var(--bg-card); border-radius:var(--radius-lg); border:1px solid var(--border-color);">
        <div style="font-size:3rem; margin-bottom:1rem;">⭐</div>
        <h3 style="color:var(--text-primary); margin-bottom:0.5rem;">No Saved Questions</h3>
        <p style="color:var(--text-secondary);">Click 'Save Question' during practice or mock tests to bookmark important questions for revision.</p>
      </div>
    `;
    return;
  }

  const savedQuestions = AppState.questions.filter(q => AppState.bookmarks.includes(q.id));

  container.innerHTML = savedQuestions.map((q, idx) => `
    <div class="card" style="margin-bottom:1.25rem;">
      <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem;">
        <span class="badge badge-gold">${q.subject} • ${q.topic}</span>
        <button class="btn btn-sm btn-secondary" onclick="toggleBookmark('${q.id}'); renderSavedQuestionsView();">★ Remove</button>
      </div>
      <div style="font-weight:700; font-size:1.05rem; margin-bottom:1rem; color:var(--text-primary);">${idx + 1}. ${q.question}</div>
      <div style="background:rgba(0,0,0,0.3); padding:0.85rem; border-radius:var(--radius-sm); font-size:0.88rem; color:var(--text-secondary);">
        <strong>Answer & Explanation:</strong> ${q.options[q.answer]}<br>${q.explanation}
      </div>
    </div>
  `).join("");
}

/* ==========================================================================
   11. DAILY CHALLENGE ("SWETHA'S DAILY 10")
   ========================================================================== */

function renderDailyChallengeView() {
  // Select 2 Reasoning, 3 Quant, 2 English, 3 GA
  const r = AppState.questions.filter(q => q.subject.includes("Reasoning")).slice(0, 2);
  const q = AppState.questions.filter(q => q.subject.includes("Quantitative")).slice(0, 3);
  const e = AppState.questions.filter(q => q.subject.includes("English")).slice(0, 2);
  const g = AppState.questions.filter(q => q.subject.includes("Awareness")).slice(0, 3);

  const dailyQuestions = [...r, ...q, ...e, ...g];

  const container = document.getElementById("daily-challenge-card");
  if (container) {
    container.innerHTML = `
      <div class="card" style="text-align:center; padding:2.5rem; background:linear-gradient(135deg, var(--bg-card) 0%, rgba(139, 92, 246, 0.1) 100%);">
        <div style="font-size:3rem; margin-bottom:1rem;">🔥</div>
        <h2 style="font-family:var(--font-heading); font-size:1.8rem; margin-bottom:0.5rem;">SWETHA'S DAILY 10</h2>
        <p style="color:var(--text-secondary); margin-bottom:1.5rem; max-width:500px; margin-left:auto; margin-right:auto;">10 Mixed questions (Reasoning, Quant, English, GA). Complete every day to build speed and accuracy!</p>
        <button class="btn btn-primary btn-gold" style="padding:0.85rem 2rem; font-size:1.1rem;" onclick="startDailyChallengeEngine()">🚀 Start Today's Challenge (10 Mins)</button>
      </div>
    `;
  }
}

function startDailyChallengeEngine() {
  const r = AppState.questions.filter(q => q.subject.includes("Reasoning")).slice(0, 2);
  const q = AppState.questions.filter(q => q.subject.includes("Quantitative")).slice(0, 3);
  const e = AppState.questions.filter(q => q.subject.includes("English")).slice(0, 2);
  const g = AppState.questions.filter(q => q.subject.includes("Awareness")).slice(0, 3);

  startQuizEngine("Swetha's Daily 10 Challenge", [...r, ...q, ...e, ...g], 600);
}

/* ==========================================================================
   12. PROGRESS DASHBOARD & ANALYTICS
   ========================================================================== */

function renderProgressView() {
  updateDashboardMetrics();

  // Weekly questions solved analytics bar visual
  const chartContainer = document.getElementById("weekly-activity-chart");
  if (chartContainer) {
    const days = [
      { day: "Mon", count: 40 },
      { day: "Tue", count: 65 },
      { day: "Wed", count: 80 },
      { day: "Thu", count: 55 },
      { day: "Fri", count: 90 },
      { day: "Sat", count: 75 },
      { day: "Sun", count: 100 }
    ];

    const max = 100;
    chartContainer.innerHTML = days.map(d => `
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; height:180px; justify-content:flex-end;">
        <div style="font-size:0.75rem; color:var(--accent-gold); font-weight:700; margin-bottom:0.3rem;">${d.count}</div>
        <div style="width:100%; max-width:32px; height:${(d.count / max) * 140}px; background:linear-gradient(180deg, var(--accent-purple), var(--accent-blue)); border-radius:var(--radius-sm) var(--radius-sm) 0 0;"></div>
        <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.5rem; font-weight:600;">${d.day}</div>
      </div>
    `).join("");
  }
}

/* ==========================================================================
   13. ADAPTIVE PRACTICE RECOMMENDATIONS
   ========================================================================== */

function checkAdaptiveRecommendations() {
  const topicStats = {};

  // Group performance by topic
  Object.keys(AppState.userAttempts).forEach(qId => {
    const q = AppState.questions.find(item => item.id === qId);
    if (q) {
      if (!topicStats[q.topic]) topicStats[q.topic] = { correct: 0, total: 0, subject: q.subject };
      topicStats[q.topic].total++;
      if (AppState.userAttempts[qId].isCorrect) topicStats[q.topic].correct++;
    }
  });

  const recBox = document.getElementById("adaptive-recommendation-banner");
  if (!recBox) return;

  let weakTopic = null;
  Object.keys(topicStats).forEach(t => {
    const acc = (topicStats[t].correct / topicStats[t].total) * 100;
    if (topicStats[t].total >= 3 && acc < 60) {
      weakTopic = { name: t, accuracy: Math.round(acc), subject: topicStats[t].subject };
    }
  });

  if (weakTopic) {
    recBox.style.display = "block";
    recBox.innerHTML = `
      <div style="background:rgba(239, 68, 68, 0.15); border:1px solid rgba(239, 68, 68, 0.3); border-radius:var(--radius-md); padding:1.25rem; margin-bottom:1.5rem; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-weight:700; color:var(--danger); font-size:1rem;">⚠️ ${weakTopic.name} needs more practice!</div>
          <div style="font-size:0.88rem; color:var(--text-secondary);">Your accuracy in ${weakTopic.name} is currently ${weakTopic.accuracy}%. Recommended targeted practice.</div>
        </div>
        <button class="btn btn-primary" onclick="startTargetedPractice('${weakTopic.subject}', '${weakTopic.name}')">PRACTICE ${weakTopic.name.toUpperCase()}</button>
      </div>
    `;
  } else {
    recBox.style.display = "none";
  }
}

function startTargetedPractice(subject, topic) {
  const pool = AppState.questions.filter(q => q.subject === subject && q.topic === topic);
  startQuizEngine(`Adaptive Practice: ${topic}`, pool, pool.length * 90);
}

/* ==========================================================================
   14. QUESTION BANK MANAGER (JSON/CSV IMPORT)
   ========================================================================== */

function handleQuestionImport() {
  const fileInput = document.getElementById("import-file-input");
  const jsonText = document.getElementById("import-json-textarea")?.value;

  if (fileInput && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (e) => processExcelImportData(e.target.result);
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => processImportData(e.target.result);
      reader.readAsText(file);
    }
  } else if (jsonText && jsonText.trim().length > 0) {
    processImportData(jsonText);
  } else {
    showToast("Please select a file (.json or .xlsx) or paste valid JSON data.", "warning");
  }
}

function processExcelImportData(arrayBuffer) {
  try {
    if (typeof XLSX === 'undefined') {
      throw new Error("SheetJS library not loaded. Please ensure XLSX library is included.");
    }
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (rawRows.length < 2) throw new Error("Excel sheet is empty or missing data rows.");

    const header = rawRows[0].map(h => String(h || '').trim().toLowerCase());
    const parsed = [];

    for (let i = 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || row.length === 0) continue;

      const qText = row[9] || row[0] || '';
      const optA = String(row[10] || row[1] || '');
      const optB = String(row[11] || row[2] || '');
      const optC = String(row[12] || row[3] || '');
      const optD = String(row[13] || row[4] || '');
      const rawAns = String(row[14] || row[15] || row[5] || 'A').trim().toUpperCase();

      let ansIdx = 0;
      if (['A', '0', 'OPTION A', '1'].includes(rawAns)) ansIdx = 0;
      else if (['B', '1', 'OPTION B', '2'].includes(rawAns)) ansIdx = 1;
      else if (['C', '2', 'OPTION C', '3'].includes(rawAns)) ansIdx = 2;
      else if (['D', '3', 'OPTION D', '4'].includes(rawAns)) ansIdx = 3;

      parsed.push({
        id: `EXCEL-IMP-${Date.now()}-${i}`,
        year: parseInt(row[2]) || 2024,
        tier: String(row[4] || 'Tier I'),
        subject: String(row[6] || 'General Awareness'),
        topic: String(row[7] || 'General'),
        shift: String(row[5] || 'Shift 1'),
        question: String(qText),
        options: [optA, optB, optC, optD],
        answer: ansIdx,
        explanation: String(row[16] || row[6] || 'No detailed explanation provided.'),
        shortcut: String(row[17] || ''),
        difficulty: String(row[8] || 'Medium'),
        source: String(row[18] || 'Uploaded Excel Dataset')
      });
    }

    const existingCustom = JSON.parse(localStorage.getItem("swetha_ssc_custom_questions") || "[]");
    const merged = existingCustom.concat(parsed);
    localStorage.setItem("swetha_ssc_custom_questions", JSON.stringify(merged));

    loadAllQuestionData();
    showToast(`Successfully imported ${parsed.length} questions from Excel file!`, "success");
    renderCurrentView();
  } catch (err) {
    showToast(`Excel Import Error: ${err.message}`, "danger");
  }
}

function processImportData(rawText) {
  try {
    const parsed = JSON.parse(rawText);
    if (!Array.isArray(parsed)) throw new Error("Import data must be a JSON array.");

    // Validate fields
    parsed.forEach((q, idx) => {
      if (!q.question || !q.options || q.answer === undefined || !q.subject) {
        throw new Error(`Item at index ${idx} is missing required fields (question, options, answer, subject).`);
      }
    });

    const existingCustom = JSON.parse(localStorage.getItem("swetha_ssc_custom_questions") || "[]");
    const merged = existingCustom.concat(parsed);
    localStorage.setItem("swetha_ssc_custom_questions", JSON.stringify(merged));

    loadAllQuestionData();
    showToast(`Successfully imported ${parsed.length} questions!`, "success");
    renderCurrentView();
  } catch (err) {
    showToast(`Import Error: ${err.message}`, "danger");
  }
}

/* ==========================================================================
   15. EVENT LISTENERS & UTILITIES
   ========================================================================== */

function setupEventListeners() {
  // Theme Toggle
  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.body.getAttribute("data-theme");
      const next = current === "light" ? "dark" : "light";
      document.body.setAttribute("data-theme", next);
      localStorage.setItem("swetha_ssc_theme", next);
    });
  }

  // Exam Mode Toggle
  const examModeBtn = document.getElementById("exam-mode-btn");
  if (examModeBtn) {
    examModeBtn.addEventListener("click", () => {
      document.body.classList.toggle("distraction-free");
      showToast(document.body.classList.contains("distraction-free") ? "Distraction-Free Exam Mode Enabled" : "Exam Mode Disabled", "info");
    });
  }

  // Global Search
  const searchInput = document.getElementById("global-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (query.length > 2) {
        window.location.hash = "#practice";
        // Perform filtering
      }
    });
  }
}

function updateStreakDisplay() {
  const streakPills = document.querySelectorAll(".streak-pill-count");
  streakPills.forEach(pill => pill.textContent = `🔥 ${AppState.streak.count} DAY STREAK`);
}

function showToast(msg, type = "info") {
  const container = document.getElementById("toast-container") || createToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>💬</span><span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}

function createToastContainer() {
  const c = document.createElement("div");
  c.id = "toast-container";
  c.className = "toast-container";
  document.body.appendChild(c);
  return c;
}

/* ==========================================================================
   16. SHORTCUTS & FORMULAS MASTER SHEET VIEW
   ========================================================================== */

function renderShortcutsView(subjectFilter = "all") {
  const container = document.getElementById("shortcuts-cards-container");
  if (!container || !window.SHORTCUTS_BANK) return;

  let shortcuts = window.SHORTCUTS_BANK;
  if (subjectFilter !== "all") {
    shortcuts = shortcuts.filter(s => s.subject === subjectFilter);
  }

  container.innerHTML = shortcuts.map(item => `
    <div class="card" style="background:var(--bg-card); border-left:4px solid var(--accent-gold);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
        <span class="badge badge-purple">${item.subject}</span>
        <span class="badge badge-gold">${item.category}</span>
      </div>
      <h3 class="card-title" style="color:var(--text-primary); margin-bottom:0.75rem;">⚡ ${item.title}</h3>
      <div style="background:rgba(0,0,0,0.35); padding:0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border-color); font-family:monospace; color:var(--accent-gold); font-weight:700; margin-bottom:0.75rem; white-space:pre-line;">
        ${item.formula}
      </div>
      <div style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:0.5rem;">
        <strong>Example / Application:</strong> ${item.example}
      </div>
      ${item.note ? `<div style="font-size:0.8rem; color:var(--accent-cyan); font-style:italic;">💡 ${item.note}</div>` : ''}
    </div>
  `).join("");
}

function filterShortcuts(subject) {
  renderShortcutsView(subject);
}

/* ==========================================================================
   17. SPEED MATH FLASHCARD ARENA & PDF REVISION EXPORT
   ========================================================================== */

let currentFlashcardDeck = "squares";
let currentFlashcardIndex = 0;
let isFlashcardFlipped = false;
let timeTrialTimer = null;
let timeTrialSecondsLeft = 60;

function renderFlashcardsView() {
  startFlashcardDeck(currentFlashcardDeck || "squares");
}

function startFlashcardDeck(deckKey) {
  if (!window.FLASHCARD_DECKS || !window.FLASHCARD_DECKS[deckKey]) return;
  currentFlashcardDeck = deckKey;
  currentFlashcardIndex = 0;
  isFlashcardFlipped = false;
  if (timeTrialTimer) clearInterval(timeTrialTimer);
  updateFlashcardCardUI();
}

function updateFlashcardCardUI() {
  const cards = window.FLASHCARD_DECKS[currentFlashcardDeck];
  if (!cards || cards.length === 0) return;

  const item = cards[currentFlashcardIndex];
  const mainText = document.getElementById("flashcard-main-text");
  const subText = document.getElementById("flashcard-sub-text");
  const tagEl = document.getElementById("flashcard-tag");
  const counterEl = document.getElementById("flashcard-counter");
  const cardBox = document.getElementById("flashcard-card");

  if (tagEl) tagEl.textContent = item.category;
  if (counterEl) counterEl.textContent = `Card ${currentFlashcardIndex + 1} of ${cards.length}`;

  if (cardBox) {
    cardBox.style.transform = "rotateY(90deg)";
    setTimeout(() => {
      if (isFlashcardFlipped) {
        if (mainText) mainText.textContent = item.back;
        if (subText) subText.textContent = `Answer (${item.hint})`;
        cardBox.style.background = "linear-gradient(135deg, var(--bg-card) 0%, rgba(16, 185, 129, 0.2) 100%)";
      } else {
        if (mainText) mainText.textContent = item.front;
        if (subText) subText.textContent = "Tap or click to reveal answer";
        cardBox.style.background = "linear-gradient(135deg, var(--bg-card) 0%, rgba(139, 92, 246, 0.2) 100%)";
      }
      cardBox.style.transform = "rotateY(0deg)";
    }, 150);
  }
}

function flipCurrentFlashcard() {
  isFlashcardFlipped = !isFlashcardFlipped;
  updateFlashcardCardUI();
}

function nextFlashcard() {
  const cards = window.FLASHCARD_DECKS[currentFlashcardDeck];
  if (!cards) return;
  currentFlashcardIndex = (currentFlashcardIndex + 1) % cards.length;
  isFlashcardFlipped = false;
  updateFlashcardCardUI();
}

function prevFlashcard() {
  const cards = window.FLASHCARD_DECKS[currentFlashcardDeck];
  if (!cards) return;
  currentFlashcardIndex = (currentFlashcardIndex - 1 + cards.length) % cards.length;
  isFlashcardFlipped = false;
  updateFlashcardCardUI();
}

function startTimeTrialMode() {
  if (timeTrialTimer) clearInterval(timeTrialTimer);
  timeTrialSecondsLeft = 60;
  startFlashcardDeck("squares");

  showToast("⚡ 60s Time Trial Started! Test your rapid calculations!", "info");

  timeTrialTimer = setInterval(() => {
    timeTrialSecondsLeft--;
    const counterEl = document.getElementById("flashcard-counter");
    if (counterEl) counterEl.textContent = `⏱️ ${timeTrialSecondsLeft}s Remaining`;

    if (timeTrialSecondsLeft <= 0) {
      clearInterval(timeTrialTimer);
      showToast("🏆 TIME TRIAL COMPLETED! Great speed calculation practice!", "success");
    }
  }, 1000);
}

function exportPrintablePDF(type) {
  showToast(`Preparing printable PDF revision document for ${type}...`, "info");
  setTimeout(() => {
    window.print();
  }, 400);
}
