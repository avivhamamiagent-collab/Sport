// ===== Storage =====
const STORAGE_KEY = "benasad_v1";
const state = load() || {
  profile: { ...PROFILE_DEFAULTS, name: "" },
  workouts: {},          // { "2026-04-27": { day: "A", sets: { exIdx: [{w,r,done}, ...] } } }
  weights: [],           // [{ date, kg }]
  todayDay: "A",
  expandedAlts: {},
  expandedMeal: {}
};

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; }
  catch { return null; }
}
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ===== Helpers =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const todayKey = () => new Date().toISOString().slice(0, 10);
const HEB_DAYS = ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];
const todayHeb = () => HEB_DAYS[new Date().getDay()];

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1800);
}

function suggestedDay() {
  const d = new Date().getDay(); // 0=Sun
  if (d === 0) return "A";
  if (d === 2) return "B";
  if (d === 4) return "C";
  return state.todayDay || "A";
}

function ensureSets(day, exIdx, count) {
  const dayKey = todayKey();
  state.workouts[dayKey] ||= { day, sets: {} };
  state.workouts[dayKey].day = day;
  state.workouts[dayKey].sets[exIdx] ||= Array.from({ length: count }, () => ({ w: "", r: "", done: false }));
  return state.workouts[dayKey].sets[exIdx];
}

// ===== Today's plan helper =====
function todayPlan() {
  const heb = todayHeb();
  const found = CARDIO_PLAN.weekly.find(d => d.day === heb);
  return found || { day: heb, type: "מנוחה", label: "יום פתוח", intensity: "—", note: "" };
}

// ===== Renderers =====
function renderHeader() {
  const dt = new Date();
  $("#todayLabel").textContent = `יום ${todayHeb()} • ${dt.toLocaleDateString("he-IL")}`;
  $("#hdrWeight").textContent = state.profile.weight;
  $("#hdrStreak").textContent = streakDays();
}

function streakDays() {
  let n = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = d.toISOString().slice(0, 10);
    const w = state.workouts[k];
    const cardioDay = CARDIO_PLAN.weekly.find(c => c.day === HEB_DAYS[d.getDay()]);
    const isRest = cardioDay && cardioDay.type === "מנוחה";
    const trained = w && Object.values(w.sets).some(arr => arr.some(s => s.done));
    if (trained || isRest) n++; else break;
  }
  return n;
}

// ----- Workout view -----
function viewWorkout() {
  const plan = todayPlan();
  const day = state.todayDay || suggestedDay();
  const W = WORKOUTS[day];
  const todayK = todayKey();
  const dayState = state.workouts[todayK];
  const totalSets = W.exercises.reduce((a, e) => a + e.sets, 0);
  const doneSets = dayState
    ? Object.values(dayState.sets).reduce((a, arr) => a + arr.filter(s => s.done).length, 0)
    : 0;

  return `
    <div class="card" style="border-color: var(--gold);">
      <div class="card-head">
        <h3>היום — יום ${escapeHtml(plan.day)}</h3>
        <span class="pill">${escapeHtml(plan.type)}</span>
      </div>
      <div style="font-size:14px;">${escapeHtml(plan.label)}</div>
      ${plan.note ? `<div style="font-size:12px;color:var(--text-dim);margin-top:6px;">${escapeHtml(plan.note)}</div>` : ""}
    </div>

    <div class="day-picker">
      ${["A","B","C"].map(d => `
        <button class="day-btn ${d===day?"active":""}" data-day="${d}">
          <span class="day-letter">${d}</span>
          <small>${escapeHtml(WORKOUTS[d].name.split("—")[1].trim())}</small>
        </button>`).join("")}
    </div>

    <div class="workout-summary">
      <div class="stat"><span class="stat-val">${doneSets}/${totalSets}</span><span class="stat-lbl">סטים</span></div>
      <div class="stat"><span class="stat-val">${W.exercises.length}</span><span class="stat-lbl">תרגילים</span></div>
      <div class="stat"><span class="stat-val">${escapeHtml(W.target)}</span><span class="stat-lbl">יום מומלץ</span></div>
    </div>

    <h2 class="section-title">${escapeHtml(W.name)}</h2>

    ${W.exercises.map((ex, i) => renderExercise(ex, i, day)).join("")}

    <div class="tip-card">
      <strong>טיפ אימון:</strong> בסט האחרון של כל תרגיל מורכב — RPE 9 (1 חזרה רחוקה מכשל). בלי זה אין צמיחה.
    </div>

    <div class="btn-row">
      <button class="btn full danger" id="resetDayBtn">איפוס יום</button>
    </div>
  `;
}

function renderExercise(ex, idx, day) {
  const sets = ensureSets(day, idx, ex.sets);
  const altsKey = `${day}_${idx}`;
  const expanded = state.expandedAlts[altsKey];
  const alts = ALTERNATIVES[ex.name] || [];

  return `
    <div class="exercise" data-ex-idx="${idx}">
      <div class="exercise-head">
        <div class="ex-title">${idx+1}. ${escapeHtml(ex.name)}</div>
        <div class="ex-target">${escapeHtml(ex.group)} • ${escapeHtml(ex.reps)}</div>
      </div>
      <div class="exercise-note">${escapeHtml(ex.note)}</div>
      <div class="set-labels">
        <span>סט</span><span>משקל (ק"ג)</span><span>חזרות</span><span>✓</span>
      </div>
      <div class="sets">
        ${sets.map((s, si) => `
          <div class="set-row ${s.done?"done":""}" data-set-idx="${si}">
            <div class="set-num">${si+1}</div>
            <input type="number" inputmode="decimal" placeholder="—" value="${s.w}" data-field="w" />
            <input type="number" inputmode="numeric" placeholder="—" value="${s.r}" data-field="r" />
            <button class="set-check" data-field="done">${s.done?"✓":""}</button>
          </div>`).join("")}
      </div>
      ${alts.length ? `
        <div style="padding: 0 14px 14px;">
          <button class="btn" data-alts="${altsKey}" style="font-size:12px;padding:8px 12px;">
            ${expanded ? "▲ הסתר" : "▼"} תרגילים חלופיים (${alts.length})
          </button>
          ${expanded ? `
            <ul style="margin:10px 0 0;padding-inline-start:18px;font-size:13px;color:var(--text-dim);">
              ${alts.map(a => `<li style="padding:4px 0;">${escapeHtml(a)}</li>`).join("")}
            </ul>
          ` : ""}
        </div>` : ""}
    </div>
  `;
}

// ----- Nutrition view -----
function viewNutrition() {
  return `
    <div class="water-banner">
      <div class="icon">💧</div>
      <div>
        <strong>כוס מים לפני כל ארוחה.</strong>
        <small style="display:block;">2 ליטר מים ביום • להתחיל לאכול שעה אחרי ההתעוררות.</small>
      </div>
    </div>

    <div class="macro-summary">
      <div><span class="m-val">${TARGETS.kcal}</span><span class="m-lbl">קק"ל / יום</span></div>
      <div><span class="m-val">${TARGETS.protein}g</span><span class="m-lbl">חלבון</span></div>
      <div><span class="m-val">${TARGETS.carbs}g</span><span class="m-lbl">פחמימות</span></div>
    </div>

    <h2 class="section-title" style="margin-top:18px;">ארוחות</h2>

    ${MEALS.map(renderMeal).join("")}

    <div class="meal boys-meal">
      <div class="meal-head">
        <h3>${escapeHtml(BOYS_MEAL.title)} 🍫</h3>
      </div>
      <div class="meal-body">
        <div style="font-size:12px;color:var(--text-dim);margin-bottom:10px;">${escapeHtml(BOYS_MEAL.subtitle)}</div>
        <ul class="macro-list">
          ${BOYS_MEAL.items.map(it => `
            <li><span>${escapeHtml(it.name)}</span><span class="qty">${escapeHtml(it.qty)}</span></li>
          `).join("")}
        </ul>
      </div>
    </div>

    <h2 class="section-title" style="margin-top:18px;">דגשים וחוקים</h2>
    ${MEAL_RULES.map(r => `
      <div class="card" style="padding:12px 14px;">
        <div style="display:flex;gap:10px;align-items:flex-start;">
          <div style="font-size:22px;">${r.icon}</div>
          <div>
            <div style="font-weight:700;color:var(--gold);font-size:14px;">${escapeHtml(r.title)}</div>
            <div style="font-size:13px;color:var(--text-dim);margin-top:2px;">${escapeHtml(r.text)}</div>
          </div>
        </div>
      </div>`).join("")}

    <div class="tip-card">
      <strong>תזכורת:</strong> בכל קטגוריה (חלבון/פחמימה/שומן) בוחרים פריט אחד. לא הכל ביחד.
    </div>
  `;
}

function renderMeal(meal) {
  const expanded = state.expandedMeal[meal.id] !== false; // default open
  return `
    <div class="meal" data-meal="${meal.id}">
      <div class="meal-head">
        <div>
          <h3>${escapeHtml(meal.title)}</h3>
          <small style="color:var(--text-dim);">${escapeHtml(meal.subtitle)}</small>
        </div>
        <button class="meal-toggle" data-meal-toggle="${meal.id}">${expanded?"−":"+"}</button>
      </div>
      ${expanded ? `
        <div class="meal-body">
          ${renderMacroGroup("חלבון",     meal.macros.protein)}
          ${renderMacroGroup("פחמימות",  meal.macros.carbs)}
          ${renderMacroGroup("שומן ותוספות", meal.macros.fats)}
        </div>` : ""}
    </div>
  `;
}

function renderMacroGroup(label, items) {
  if (!items || !items.length) return "";
  return `
    <div class="macro-group">
      <span class="macro-label">${escapeHtml(label)}</span>
      <ul class="macro-list">
        ${items.map(it => `
          <li>
            <span>${escapeHtml(it.name)}</span>
            <span class="qty">${escapeHtml(it.qty || "")}</span>
          </li>`).join("")}
      </ul>
    </div>
  `;
}

// ----- Tracker view -----
function viewTracker() {
  const weights = [...state.weights].sort((a,b) => a.date.localeCompare(b.date));
  const last = weights[weights.length-1];
  const start = weights[0];
  const delta = last && start ? (last.kg - start.kg).toFixed(1) : "0.0";

  const recentWorkouts = Object.entries(state.workouts)
    .sort((a,b) => b[0].localeCompare(a[0]))
    .slice(0, 10);

  return `
    <h2 class="section-title">משקל גוף</h2>
    <div class="card">
      <div class="weight-input-row">
        <input type="number" inputmode="decimal" id="weightInput" placeholder="המשקל שלך הבוקר (ק&quot;ג)" step="0.1" />
        <button class="btn primary" id="logWeightBtn">שמור</button>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:12px;font-size:13px;color:var(--text-dim);">
        <span>נוכחי: <strong style="color:var(--gold);">${last?last.kg:state.profile.weight} ק"ג</strong></span>
        <span>שינוי כולל: <strong style="color:${delta<0?"var(--green)":"var(--text)"};">${delta} ק"ג</strong></span>
      </div>
      ${weights.length ? `
        <ul class="weight-history">
          ${weights.slice().reverse().map((w, i, arr) => {
            const next = arr[i+1];
            const d = next ? (w.kg - next.kg).toFixed(1) : "0.0";
            const cls = d < 0 ? "down" : d > 0 ? "up" : "";
            return `<li>
              <span>${escapeHtml(w.date)} — ${w.kg} ק"ג</span>
              ${next ? `<span class="delta ${cls}">${d > 0 ? "+" : ""}${d}</span>` : ""}
            </li>`;
          }).join("")}
        </ul>` : `<div class="empty">עדיין אין שקילות. תתחיל מחר בבוקר.</div>`}
    </div>

    <h2 class="section-title" style="margin-top:18px;">אימונים אחרונים</h2>
    <div class="history-list">
      ${recentWorkouts.length ? recentWorkouts.map(([date, w]) => {
        const total = Object.values(w.sets).reduce((a,arr)=>a+arr.length,0);
        const done = Object.values(w.sets).reduce((a,arr)=>a+arr.filter(s=>s.done).length,0);
        return `<div class="history-item">
          <div>
            <div class="h-day">יום ${escapeHtml(w.day)}</div>
            <div class="h-date">${escapeHtml(date)}</div>
          </div>
          <div style="text-align:left;">
            <div style="color:var(--gold);font-weight:700;">${done}/${total}</div>
            <small style="color:var(--text-dim);">סטים</small>
          </div>
        </div>`;
      }).join("") : `<div class="empty">עדיין לא רשמת אימון.</div>`}
    </div>
  `;
}

// ----- Profile view -----
function viewProfile() {
  return `
    <h2 class="section-title">פרופיל</h2>
    <div class="profile-grid">
      <div class="profile-field">
        <label>גיל</label>
        <input type="number" id="pf_age" value="${state.profile.age}" />
      </div>
      <div class="profile-field">
        <label>משקל (ק"ג)</label>
        <input type="number" id="pf_weight" step="0.1" value="${state.profile.weight}" />
      </div>
      <div class="profile-field">
        <label>גובה (ס"מ)</label>
        <input type="number" id="pf_height" value="${state.profile.height}" />
      </div>
      <div class="profile-field">
        <label>סוג גוף</label>
        <input type="text" value="${escapeHtml(state.profile.bodyType)}" disabled />
      </div>
    </div>

    <div class="tip-card" style="border-color:rgba(214,177,90,0.4);background:linear-gradient(145deg,rgba(214,177,90,0.1),rgba(214,177,90,0.02));">
      <strong style="color:var(--gold);">מטרה:</strong> ${escapeHtml(state.profile.goal)}
      <br/><small style="color:var(--text-dim);">${state.profile.weeksToGoal} שבועות לעמידה ביעד.</small>
    </div>

    <h2 class="section-title" style="margin-top:20px;">אנליזה אישית</h2>
    <div class="card">
      <div class="card-head"><h3>${escapeHtml(COACHING.bodyType)}</h3></div>
      <div style="font-size:14px;color:var(--text-dim);">${escapeHtml(COACHING.summary)}</div>
    </div>

    <h2 class="section-title" style="margin-top:18px;">עדיפויות לפי הגוף שלך</h2>
    ${COACHING.priorities.map(p => `
      <div class="card" style="padding:14px;">
        <div style="font-weight:700;color:var(--gold);font-size:14px;">${escapeHtml(p.title)}</div>
        <div style="font-size:13px;color:var(--text-dim);margin-top:4px;">${escapeHtml(p.text)}</div>
      </div>`).join("")}

    <h2 class="section-title" style="margin-top:18px;">שיפורים לתוכנית</h2>
    <div class="card">
      <ul style="margin:0;padding-inline-start:18px;font-size:13px;line-height:1.7;">
        ${COACHING.programTweaks.map(t => `<li>${escapeHtml(t)}</li>`).join("")}
      </ul>
    </div>

    <div class="tip-card">
      <strong>פסק דין — קאט או בולק?</strong><br/>
      ${escapeHtml(COACHING.cutVsBulkVerdict)}
    </div>

    <h2 class="section-title" style="margin-top:18px;">תוכנית אירובי שבועית</h2>
    <div class="card" style="padding:0;overflow:hidden;">
      ${CARDIO_PLAN.weekly.map(d => `
        <div style="padding:12px 14px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;gap:10px;">
          <div style="display:flex;flex-direction:column;">
            <span style="font-weight:700;color:var(--gold);font-size:14px;">${escapeHtml(d.day)}</span>
            <span style="font-size:12px;color:var(--text-dim);margin-top:2px;">${escapeHtml(d.note)}</span>
          </div>
          <div style="text-align:left;flex-shrink:0;">
            <div style="font-size:13px;font-weight:600;">${escapeHtml(d.label)}</div>
            <small style="color:var(--text-dim);">${escapeHtml(d.intensity)}</small>
          </div>
        </div>`).join("")}
    </div>

    <h2 class="section-title" style="margin-top:18px;">חוקי אירובי</h2>
    <div class="card">
      <ul style="margin:0;padding-inline-start:18px;font-size:13px;line-height:1.7;">
        ${CARDIO_PLAN.cardioRules.map(r => `<li>${escapeHtml(r)}</li>`).join("")}
      </ul>
    </div>

    <div class="btn-row">
      <button class="btn full danger" id="resetAllBtn">איפוס כל הנתונים</button>
    </div>
  `;
}

// ===== Tab routing =====
function render() {
  const tab = document.querySelector(".tab.active").dataset.tab;
  const view = $("#view");
  if (tab === "workout")   view.innerHTML = viewWorkout();
  if (tab === "nutrition") view.innerHTML = viewNutrition();
  if (tab === "tracker")   view.innerHTML = viewTracker();
  if (tab === "profile")   view.innerHTML = viewProfile();
  attachEvents(tab);
  renderHeader();
}

function attachEvents(tab) {
  if (tab === "workout") {
    $$(".day-btn").forEach(btn => btn.addEventListener("click", () => {
      state.todayDay = btn.dataset.day;
      save();
      render();
    }));
    $$(".set-row input").forEach(inp => inp.addEventListener("input", e => {
      const row = e.target.closest(".set-row");
      const ex  = e.target.closest(".exercise");
      const exIdx = +ex.dataset.exIdx;
      const setIdx = +row.dataset.setIdx;
      const field = e.target.dataset.field;
      const day = state.todayDay;
      ensureSets(day, exIdx, WORKOUTS[day].exercises[exIdx].sets);
      state.workouts[todayKey()].sets[exIdx][setIdx][field] = e.target.value;
      save();
    }));
    $$(".set-check").forEach(btn => btn.addEventListener("click", () => {
      const row = btn.closest(".set-row");
      const ex  = btn.closest(".exercise");
      const exIdx = +ex.dataset.exIdx;
      const setIdx = +row.dataset.setIdx;
      const day = state.todayDay;
      const arr = ensureSets(day, exIdx, WORKOUTS[day].exercises[exIdx].sets);
      arr[setIdx].done = !arr[setIdx].done;
      save();
      render();
    }));
    $$("[data-alts]").forEach(btn => btn.addEventListener("click", () => {
      const k = btn.dataset.alts;
      state.expandedAlts[k] = !state.expandedAlts[k];
      save();
      render();
    }));
    $("#resetDayBtn")?.addEventListener("click", () => {
      if (!confirm("לאפס את כל הסטים של היום?")) return;
      delete state.workouts[todayKey()];
      save();
      render();
      toast("היום אופס");
    });
  }

  if (tab === "nutrition") {
    $$("[data-meal-toggle]").forEach(btn => btn.addEventListener("click", () => {
      const id = btn.dataset.mealToggle;
      const cur = state.expandedMeal[id];
      state.expandedMeal[id] = cur === false ? true : false;
      save();
      render();
    }));
  }

  if (tab === "tracker") {
    $("#logWeightBtn")?.addEventListener("click", () => {
      const v = parseFloat($("#weightInput").value);
      if (!v || v < 30 || v > 200) { toast("משקל לא תקין"); return; }
      state.weights.push({ date: todayKey(), kg: v });
      state.profile.weight = v;
      save();
      render();
      toast(`נשמר: ${v} ק"ג`);
    });
  }

  if (tab === "profile") {
    ["age","weight","height"].forEach(f => {
      $(`#pf_${f}`)?.addEventListener("change", e => {
        state.profile[f] = parseFloat(e.target.value);
        save();
        renderHeader();
      });
    });
    $("#resetAllBtn")?.addEventListener("click", () => {
      if (!confirm("לאפס את כל הנתונים? לא ניתן לשחזר.")) return;
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });
  }
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  // first-run defaults: today's day per the schedule
  if (!state.todayDay) state.todayDay = suggestedDay();

  $$(".tab").forEach(t => t.addEventListener("click", () => {
    $$(".tab").forEach(b => b.classList.remove("active"));
    t.classList.add("active");
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }));

  render();
});
