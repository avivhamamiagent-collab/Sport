// ===== Workout program (ABC split, 3x/week) =====
const WORKOUTS = {
  A: {
    name: "יום A — חזה, טרייספס, בטן",
    target: "ראשון",
    exercises: [
      { name: "לחיצת חזה בשכיבה",            sets: 3, reps: "10-12", note: "שליטה בתנועה, ירידה איטית", group: "חזה" },
      { name: "פרפר בשכיבה או מכונה",         sets: 3, reps: "12-15", note: "סחיטה בסוף התנועה", group: "חזה" },
      { name: "לחיצת חזה בשיפוע חיובי",       sets: 3, reps: "10-12", note: "פוקוס על חזה עליון", group: "חזה" },
      { name: "פשיטת מרפקים בפולי עליון",     sets: 3, reps: "10-12", note: "שליטה וסחיטה בסוף", group: "טרייספס" },
      { name: "לחיצה צרפתית עם מוט/משקולת",  sets: 3, reps: "10-12", note: "פוקוס על טרייספס", group: "טרייספס" },
      { name: "קיק בק עם משקולת",             sets: 3, reps: "12-15", note: "טווח תנועה מלא", group: "טרייספס" },
      { name: "הרחקה קדמית עם משקולות",       sets: 3, reps: "12-15", note: "לא להניף, שליטה", group: "כתפיים" },
      { name: "כפיפות בטן רגילות",            sets: 3, reps: "15-20", note: "סחיטה בסוף כל חזרה", group: "בטן" },
      { name: "הרמות רגליים בשכיבה",          sets: 3, reps: "15-20", note: "פוקוס בטן תחתונה", group: "בטן" },
      { name: "פלאנק",                         sets: 3, reps: "30-45 שניות", note: "לשמור על גב ישר", group: "בטן" },
      { name: "אופניים",                       sets: 3, reps: "20 לכל צד",   note: "טוויסט מלא בכל חזרה", group: "בטן" }
    ]
  },
  B: {
    name: "יום B — גב, ביצפס, בטן",
    target: "שלישי",
    exercises: [
      { name: "חתירה בפולי ישיבה",            sets: 3, reps: "10-12", note: "להוביל עם המרפקים", group: "גב" },
      { name: "פול-אובר במכונה או דאמבל",     sets: 3, reps: "12-15", note: "טווח תנועה מלא", group: "גב" },
      { name: "משיכת פולי עליון בפיסוק",      sets: 3, reps: "10-12", note: "פוקוס על שרירי הגב הרחבים", group: "גב" },
      { name: "חתירה עם מוט",                  sets: 3, reps: "10-12", note: "גב ישר, לא לעגל", group: "גב" },
      { name: "כפיפת מרפקים עם מוט W",        sets: 3, reps: "10-12", note: "להרגיש את השריר עובד", group: "ביצפס" },
      { name: "כפיפת מרפקים עם משקולות",      sets: 3, reps: "12-15", note: "טווח תנועה מלא", group: "ביצפס" },
      { name: "כפיפת מרפקים בקונצנטרציה",    sets: 3, reps: "10-12", note: "סחיטה בסוף התנועה", group: "ביצפס" },
      { name: "הרחקה לצד אחורה עם משקולות",   sets: 3, reps: "12-15", note: "שליטה ולא להניף", group: "כתפיים" },
      { name: "כפיפות בטן על ספסל",           sets: 3, reps: "15-20", note: "סחיטה בסוף כל חזרה", group: "בטן" },
      { name: "הרמות רגליים במתח",             sets: 3, reps: "12-15", note: "בטן תחתונה", group: "בטן" },
      { name: "פלאנק צדדי",                    sets: 3, reps: "30 שניות לצד", note: "לשמור על קו גוף", group: "בטן" },
      { name: "רוסיאן טוויסט",                 sets: 3, reps: "20 לכל צד", note: "שליטה, לא לרוץ", group: "בטן" }
    ]
  },
  C: {
    name: "יום C — רגליים, כתפיים, בטן",
    target: "חמישי",
    exercises: [
      { name: "לחיצת רגליים",                  sets: 3, reps: "10-12", note: "לרדת עמוק ולשלוט בעלייה", group: "רגליים" },
      { name: "פשיטת רגליים במכונה",          sets: 3, reps: "12-15", note: "סחיטה בסוף כל חזרה", group: "רגליים" },
      { name: "כפיפת רגליים בשכיבה",          sets: 3, reps: "12-15", note: "טווח תנועה מלא", group: "רגליים" },
      { name: "דדליפט רומני עם משקולות",      sets: 3, reps: "10-12", note: "גב ישר, לא לעגל", group: "רגליים" },
      { name: "הרחקה לצדדים עם משקולות",       sets: 3, reps: "12-15", note: "שליטה, לא להניף", group: "כתפיים" },
      { name: "פרפר הפוך במכונה",             sets: 3, reps: "12-15", note: "פוקוס על כתף אחורית", group: "כתפיים" },
      { name: "הרחקה קדמית עם משקולות",       sets: 3, reps: "12-15", note: "שליטה, לא להניף", group: "כתפיים" },
      { name: "הרחקה לצד אחורה עם משקולות",   sets: 3, reps: "12-15", note: "שליטה, לא להניף", group: "כתפיים" },
      { name: "לחיצת כתפיים עם מוט/משקולות",  sets: 3, reps: "10-12", note: "טווח תנועה מלא", group: "כתפיים" },
      { name: "כפיפות בטן הפוכות",             sets: 3, reps: "15-20", note: "סחיטה בסוף כל חזרה", group: "בטן" },
      { name: "הרמות רגליים בשכיבה",          sets: 3, reps: "15-20", note: "פוקוס על בטן תחתונה", group: "בטן" },
      { name: "פלאנק",                         sets: 3, reps: "30-45 שניות", note: "לשמור על גב ישר", group: "בטן" },
      { name: "אופניים",                       sets: 3, reps: "20 לכל צד", note: "טוויסט מלא בכל חזרה", group: "בטן" }
    ]
  }
};

// ===== Nutrition program (4 meals + boys' meal) =====
// Source: BENASAD plan (13_12_2025), adapted from screenshots.
const MEALS = [
  {
    id: "m1",
    title: "ארוחה ראשונה",
    subtitle: "בוקר — לפתוח את היום",
    waterReminder: true,
    macros: {
      protein: [
        { name: "חביתה (2 ביצים, אחת ללא חלמון)", qty: "" },
        { name: "סלט טונה (טונה במים)", qty: "פחית" },
        { name: "יוגורט חלבון", qty: "50 גרם, עד 135 ק\"ל" },
        { name: "קוטג' 5%", qty: "חצי גביע" },
        { name: "ביצים קשות", qty: "1.5 יחידות" },
        { name: "יוגורט סקי", qty: "חצי גביע" },
        { name: "משקה חלבון", qty: "עד 140 ק\"ל" }
      ],
      carbs: [
        { name: "לחמניות קלות", qty: "2 (עד 120 ק\"ל ליחידה)" },
        { name: "בננה", qty: "2 יחידות" },
        { name: "לחם מלא", qty: "4 פרוסות" },
        { name: "טורטיה מחיטה מלאה", qty: "2 יחידות" },
        { name: "פיתה בוסמין", qty: "1 יחידה" },
        { name: "גרנולה", qty: "60 גרם (2 כוסות חד\"פ)" },
        { name: "שיבולת שועל", qty: "60 גרם (2 כוסות חד\"פ)" }
      ],
      fats: [
        { name: "אבוקדו", qty: "2 פרוסות" },
        { name: "טחינה גולמית", qty: "חצי כף" },
        { name: "זיתים ירוקים", qty: "6 יחידות" },
        { name: "שמן זית", qty: "כפית שטוחה" },
        { name: "שקדים", qty: "7 יחידות" },
        { name: "אגוזי מלך", qty: "3 יחידות" },
        { name: "קשיו", qty: "7 יחידות" }
      ]
    }
  },
  {
    id: "m2",
    title: "ארוחה שנייה",
    subtitle: "צהריים — הארוחה הגדולה",
    waterReminder: true,
    macros: {
      protein: [
        { name: "פסטרמה דלת שומן", qty: "3 פרוסות" },
        { name: "חזה עוף בגריל", qty: "4 יחידות בינוניות" },
        { name: "פרגית צלויה", qty: "4 יחידות בינוניות" },
        { name: "שניצל עוף אפוי/צלוי", qty: "3 יחידות" },
        { name: "המבורגר בקר דל שומן", qty: "183 גרם" },
        { name: "דג סלמון בתנור", qty: "1.5 יחידות בינוני" },
        { name: "קבב עוף/דג", qty: "5 יחידות" },
        { name: "סינטה", qty: "יחידה וחצי בינונית (גודל כף יד בערך)" }
      ],
      carbs: [
        { name: "תפוח אדמה אפוי", qty: "3 יחידות בינוניות" },
        { name: "בטטה", qty: "3 יחידות בינוניות" },
        { name: "אורז לבן/מלא", qty: "1.5 כוסות" },
        { name: "פסטה מבושלת", qty: "1.5 כוסות" },
        { name: "פתיתים", qty: "חצי כוס" },
        { name: "פיתה לבנה", qty: "2 יחידות" },
        { name: "קוסקוס", qty: "1.5 כוסות" }
      ],
      fats: [
        { name: "אבוקדו", qty: "2 פרוסות" },
        { name: "טחינה גולמית", qty: "חצי כף" },
        { name: "זיתים ירוקים", qty: "6 יחידות" },
        { name: "שמן זית", qty: "כפית שטוחה" },
        { name: "שקדים", qty: "7 יחידות" },
        { name: "אגוזי מלך", qty: "3 יחידות" },
        { name: "קשיו", qty: "7 יחידות" }
      ]
    }
  },
  {
    id: "m3",
    title: "ארוחה שלישית",
    subtitle: "אחה\"צ — דחיפה לעוד חלבון",
    waterReminder: true,
    macros: {
      protein: [
        { name: "פסטרמה דלת שומן", qty: "5 פרוסות" },
        { name: "סלט טונה (טונה במים)", qty: "2 פחיות" },
        { name: "יוגורט חלבון", qty: "3 גביעים" },
        { name: "גבינה לבנה 5%", qty: "1.2 גביע" },
        { name: "ביצים קשות", qty: "4 ביצים, אחת ללא חלמון" },
        { name: "מעדן חלבון", qty: "עד 335 ק\"ל" },
        { name: "משקה חלבון", qty: "עד 335 ק\"ל" },
        { name: "אבקת חלבון", qty: "2 סקופים" }
      ],
      carbs: [
        { name: "פסטה מבושלת", qty: "חצי כוס" },
        { name: "טוסט מלחם מלא", qty: "2 פרוסות" },
        { name: "לחמנייה קלה", qty: "חצי" },
        { name: "פיתה בוסמין", qty: "1 יחידה" },
        { name: "טורטיה מחיטה מלאה", qty: "1 יחידה" },
        { name: "אורז לבן/מלא", qty: "חצי כוס" },
        { name: "פתיתים", qty: "חצי כוס" }
      ],
      fats: [
        { name: "קשיו", qty: "8 יחידות" },
        { name: "טחינה גולמית", qty: "1 כף" },
        { name: "אבוקדו", qty: "שליש" },
        { name: "שקדים", qty: "12 יחידות" },
        { name: "אגוזי מלך", qty: "5 יחידות" },
        { name: "שמן זית", qty: "2 כפות" },
        { name: "מיונז לייט", qty: "1.5 כפות" },
        { name: "מיונז/קטשופ", qty: "3 כפות" }
      ]
    }
  },
  {
    id: "m4",
    title: "ארוחה רביעית",
    subtitle: "ערב — סוגרים את היום",
    waterReminder: true,
    macros: {
      protein: [
        { name: "פסטרמה דלת שומן", qty: "2 פרוסות" },
        { name: "משקה חלבון", qty: "140 גרם" },
        { name: "חטיף חלבון", qty: "20 גרם" },
        { name: "גבינת סקי", qty: "חצי גביע" },
        { name: "ביצה קשה", qty: "1 יחידה" },
        { name: "גבינה לבנה 5%", qty: "חצי גביע" },
        { name: "גבינה צהובה 9%", qty: "2 פרוסות" }
      ],
      carbs: [
        { name: "בטטה", qty: "1.5 יחידות בינוניות" },
        { name: "פסטה מבושלת", qty: "חצי כוס" },
        { name: "לחם מלא", qty: "1 פרוסה" },
        { name: "פיתה לבנה", qty: "חצי פיתה / פיתה ביס" },
        { name: "טורטיה מחיטה מלאה", qty: "1 יחידה" },
        { name: "פתיתים", qty: "1 כף" },
        { name: "קוסקוס", qty: "1 כף" }
      ],
      fats: []
    }
  }
];

const BOYS_MEAL = {
  title: "ארוחת בנים",
  subtitle: "בחר מתוך הרשימה — מנה אחת ביום",
  items: [
    { name: "מעדן חלבון", qty: "1 (עד 150 ק\"ל)" },
    { name: "משקה חלבון", qty: "יחידה 1" },
    { name: "חטיף חלבון", qty: "עד 150 ק\"ל" },
    { name: "יוגורט חלבון", qty: "יחידה 1" },
    { name: "פירות עונתיים", qty: "2 לבחירה" },
    { name: "גרנולה", qty: "25 גרם" },
    { name: "פרכיות", qty: "6 יחידות + 2 כפות דבש/ריבה" },
    { name: "שוקולד חלב", qty: "6 קוביות" },
    { name: "150 קלוריות חופשיות", qty: "" }
  ]
};

// ===== Daily macro target (Diego's contract: ~2300 kcal, 150g protein) =====
const TARGETS = {
  kcal: 2300,
  protein: 150,
  carbs: 260,
  fat: 70
};

// ===== Pre-meal tips =====
const TIPS = [
  "כוס מים לפני כל ארוחה",
  "שקילה פעם בשבוע — באותו יום, באותה שעה, על בטן ריקה",
  "חלבון בכל ארוחה — אחרת לא תגיע ל-150 גרם ביום",
  "פאדל/כדורגל הם בונוס, לא תירוץ להעמיס פחמימות"
];

// ===== Meal rules (from page 7 — דגשים) =====
const MEAL_RULES = [
  { icon: "⚖️", title: "שקילה",        text: "פעם בשבוע — באותו יום, אותה שעה, על בטן ריקה." },
  { icon: "🕒", title: "סדר וזמנים",   text: "אין חשיבות לסדר או לזמני הארוחות — מה שמתאים ליום שלך." },
  { icon: "☕", title: "קפה",          text: "עד 2 כוסות קפה עם חלב ביום." },
  { icon: "🔁", title: "כל פריט = אופציה", text: "בכל ארוחה בוחרים פריט אחד מהקטגוריה (חלבון/פחמימה/שומן)." },
  { icon: "🍰", title: "צ'יט מיל",     text: "אחד בשבוע — מנה עיקרית + קינוח, על חשבון ארוחה מס' 2 בלבד." },
  { icon: "🌶️", title: "תבלינים",      text: "באופן חופשי — מלח, פלפל, לימון, חומץ, עשבי תיבול." },
  { icon: "⏳", title: "מרווח בין ארוחות", text: "כ-3-4 שעות בין ארוחה לארוחה." },
  { icon: "🌅", title: "ארוחת בוקר",   text: "להתחיל לאכול כשעה אחרי ההתעוררות, ואחרי לפחות 3 כוסות מים." },
  { icon: "💧", title: "מים",          text: "מינימום 2 ליטר ביום." },
  { icon: "🥤", title: "משקאות זירו",  text: "באופן חופשי." }
];

// ===== Exercise alternatives — for variation or when machine is taken =====
const ALTERNATIVES = {
  // Day A
  "לחיצת חזה בשכיבה":             ["לחיצת חזה במכונה", "לחיצת חזה במשקולות יד", "שכיבות סמיכה (עד כשל)"],
  "פרפר בשכיבה או מכונה":         ["קייבל קרוסאובר", "Pec-Deck במכונה", "פרפר עם משקולות בשיפוע"],
  "לחיצת חזה בשיפוע חיובי":       ["לחיצה בשיפוע במשקולות יד", "לחיצת חזה עליונה במכונה (Smith)", "Landmine press"],
  "פשיטת מרפקים בפולי עליון":     ["Rope pushdown", "V-bar pushdown", "Reverse-grip pushdown"],
  "לחיצה צרפתית עם מוט/משקולת":  ["Skull crushers בשיפוע", "Overhead DB extension", "JM press"],
  "קיק בק עם משקולת":             ["טרייספס במכונה (dip-machine)", "Cable kickback", "Bench dips"],
  "הרחקה קדמית עם משקולות":       ["Cable front raise", "Plate front raise", "Landmine front raise"],
  // Day B
  "חתירה בפולי ישיבה":            ["חתירה במכונה (chest-supported)", "T-bar row", "Single-arm cable row"],
  "פול-אובר במכונה או דאמבל":     ["Straight-arm pulldown", "Cable pullover על שיפוע", "Lat prayer"],
  "משיכת פולי עליון בפיסוק":      ["מתח (Pull-up)", "Lat pulldown אחיזה רחבה", "Neutral-grip pulldown"],
  "חתירה עם מוט":                  ["Pendlay row", "Meadows row", "Single-arm DB row"],
  "כפיפת מרפקים עם מוט W":        ["EZ-bar curl", "Preacher curl", "Spider curl"],
  "כפיפת מרפקים עם משקולות":      ["Hammer curl", "Incline DB curl", "Cable bayesian curl"],
  "כפיפת מרפקים בקונצנטרציה":    ["Cable curl single-arm", "Spider curl", "21s with EZ bar"],
  "הרחקה לצד אחורה עם משקולות":   ["Reverse pec-deck", "Face pull", "Cable rear delt fly"],
  // Day C
  "לחיצת רגליים":                  ["סקוואט עם מוט", "Hack squat", "Bulgarian split squat"],
  "פשיטת רגליים במכונה":          ["Sissy squat", "Reverse lunge", "Step-up"],
  "כפיפת רגליים בשכיבה":          ["Seated leg curl", "Nordic curl", "GHR (glute-ham raise)"],
  "דדליפט רומני עם משקולות":      ["Good morning", "Single-leg RDL", "Cable pull-through"],
  "הרחקה לצדדים עם משקולות":      ["Cable lateral raise", "Machine lateral raise", "Lean-away DB lateral"],
  "פרפר הפוך במכונה":             ["Face pull", "Reverse fly עם משקולות (גוף ב-45°)", "Cable rear delt"],
  "לחיצת כתפיים עם מוט/משקולות":  ["Arnold press", "Machine shoulder press", "Z-press"],
  // Abs (shared)
  "כפיפות בטן רגילות":            ["Cable crunch", "Decline crunch", "Ab-wheel rollout"],
  "הרמות רגליים בשכיבה":          ["Hanging leg raise", "Captain's chair", "Reverse crunch"],
  "פלאנק":                         ["RKC plank", "Plank עם kettlebell drag", "Stir-the-pot"],
  "אופניים":                       ["Russian twist עם פלייט", "Hanging knee twist", "Standing oblique cable crunch"],
  "כפיפות בטן על ספסל":           ["Decline sit-up", "Cable crunch", "Sit-up עם פלייט"],
  "הרמות רגליים במתח":            ["Captain's chair leg raise", "Toes-to-bar", "Hanging knee raise"],
  "פלאנק צדדי":                    ["Side plank עם hip dip", "Copenhagen plank", "Side plank עם reach"],
  "רוסיאן טוויסט":                 ["Cable woodchopper", "Plate twist", "Pallof press"],
  "כפיפות בטן הפוכות":            ["Reverse crunch על ספסל", "Hanging knee raise", "Dead bug"]
};

// ===== Cardio plan =====
const CARDIO_PLAN = {
  weekly: [
    { day: "ראשון",  type: "כוח",     label: "אימון A",         intensity: "כוח", note: "10 דק' הליכה בשיפוע בסוף האימון." },
    { day: "שני",   type: "אירובי", label: "LISS — 45-60 דק'", intensity: "נמוכה", note: "הליכה מהירה / שיפוע 8-10 על הליכון. דופק 60-70%." },
    { day: "שלישי", type: "כוח",     label: "אימון B",         intensity: "כוח", note: "סוגרים גב/ביצפס. אם יש כוח — 10 דק' הליכה בסוף." },
    { day: "רביעי", type: "ספורט", label: "פאדל / כדורגל",   intensity: "בינונית-גבוהה", note: "בונוס. לא משנה את התפריט." },
    { day: "חמישי", type: "כוח",     label: "אימון C",         intensity: "כוח", note: "רגליים+כתפיים. אחרי זה אין אירובי." },
    { day: "שישי",  type: "מנוחה", label: "מנוחה אקטיבית",  intensity: "קלה", note: "8K צעדים + Meal-prep לשבוע." },
    { day: "שבת",   type: "מנוחה", label: "מנוחה מוחלטת",   intensity: "—",   note: "התאוששות מלאה. שינה 7-8 שעות." }
  ],
  dailySteps: 10000,
  cardioRules: [
    "אירובי תמיד בעצימות נמוכה — לא לשרוף את מערכת העצבים לפני אימון כוח.",
    "בימי כוח: אירובי רק בסוף, לא לפני.",
    "אחרי פאדל/כדורגל — אין אירובי נוסף למחרת בבוקר.",
    "10K צעדים ביום זה הרצפה. NEAT הוא המנוע השקט של הריקומפ."
  ]
};

// ===== Body coaching — based on user's frame (72kg / 176cm / 26yo, skinny-fat) =====
const COACHING = {
  bodyType: "Skinny-fat קלאסי",
  summary: "רזה כללית עם שומן עיקש בצדדים ובבטן תחתונה. הגוף שלך בנוי בדיוק ל-Recomposition: לעבות שריר ולשרוף שומן במקביל.",
  priorities: [
    { title: "V-Taper", text: "להרחיב את הגב העליון (lats). זה מה שמצמצם את הצדדים ויזואלית — לא הבטן." },
    { title: "כתפיים רוחביות", text: "Lateral delts זה ה-cheat-code לרוחב גוף. הוסף 2-3 סטים נוספים בכל אימון C." },
    { title: "חזה עליון", text: "החזה התחתון אצלך מפותח יחסית. עבור ל-20-30° שיפוע ולא יותר." },
    { title: "יציבה", text: "יש לך כתפיים מעט קדימה (סימן למסך). Face-pull בכל אימון, 3x15." },
    { title: "ליבה ואלכסונים", text: "הצדדים לא ירדו מטוויסטים — הם ירדו מקלוריות. אבל לעבד אותם יוצר 'V' בבטן." }
  ],
  programTweaks: [
    "להוסיף Face-pull (3×15) בסוף אימוני A ו-B — לתקן יציבה.",
    "באימון C: הוסף 2 סטים נוספים של Lateral raise (זה השריר שיתן לך הכי הרבה רוחב).",
    "Pull-ups (אפילו עם גומייה) פעמיים בשבוע, 3 סטים. בלעדי זה אין V.",
    "כל סט אחרון של תרגילים מורכבים — RPE 9 (1 חזרה רחוקה מכשל). בלי זה אין צמיחה."
  ],
  cutVsBulkVerdict: "אל תבולק. אתה צריך פאזת Recomp של 10-12 שבועות: גירעון קל של 200-300 קק\"ל, חלבון 150-160 גרם, אימוני כוח אינטנסיביים."
};

// ===== Profile defaults =====
const PROFILE_DEFAULTS = {
  age: 26,
  weight: 72,
  height: 176,
  goal: "Recomposition — לרדת לאחוזי שומן 12-13% עד יולי",
  trainingLevel: "בינוני",
  bodyType: "Skinny-fat",
  weeksToGoal: 11
};

