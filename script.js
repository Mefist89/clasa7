// ======================= ЗАДАНИЕ 1 =======================
const questions = [
  {
    ctx: "Numărul de elevi din clasă",
    val: "28",
    answer: "int",
    hint: "Elevii se numără cu numere întregi!",
  },
  {
    ctx: "Prețul unei pâini (în lei)",
    val: "36.5",
    answer: "float",
    hint: "Prețul poate fi cu bani — număr zecimal!",
  },
  {
    ctx: "Litera notei din catalog",
    val: "'A'",
    answer: "char",
    hint: "O singură literă — tipul char!",
  },
  {
    ctx: "Este aprinsă lumina în clasă?",
    val: "true",
    answer: "bool",
    hint: "Da/Nu — acesta este bool!",
  },
  {
    ctx: "Temperatura afară (°C)",
    val: "-2.5",
    answer: "float",
    hint: "Temperatura poate fi zecimală!",
  },
  {
    ctx: "Numărul apartamentului",
    val: "47",
    answer: "int",
    hint: "Numărul — este un întreg!",
  },
  {
    ctx: "Litera rutei autobuzului",
    val: "'K'",
    answer: "char",
    hint: "Litera rutei — un singur caracter char!",
  },
  {
    ctx: "Este deschisă ușa școlii?",
    val: "false",
    answer: "bool",
    hint: "Deschis sau nu — este bool!",
  },
  {
    ctx: "Numărul de pagini dintr-o carte",
    val: "312",
    answer: "int",
    hint: "Paginile — număr întreg!",
  },
  {
    ctx: "Greutatea ghiozdanului (în kg)",
    val: "4.8",
    answer: "float",
    hint: "Greutatea cu grame — număr zecimal float!",
  },
];

const types = ["int", "float", "char", "bool"];
let answered = {};
let correct = 0;

function buildTask1() {
  answered = {};
  correct = 0;
  const grid = document.getElementById("q-grid");
  grid.innerHTML = "";
  document.getElementById("score-num").textContent = "0";
  document.getElementById("score-total").textContent = questions.length;

  questions.forEach((q, i) => {
    const card = document.createElement("div");
    card.className = "question-card";
    card.id = "qcard-" + i;

    const opts = types
      .map(
        (t) =>
          `<button class="opt-btn ${t}" onclick="answerQ(${i},'${t}')">${t}</button>`,
      )
      .join("");

    card.innerHTML = `
      <div class="q-situation">${q.ctx}</div>
      <div class="q-value">${q.val}</div>
      <div class="q-options" id="qopts-${i}">${opts}</div>
      <div class="q-feedback" id="qfb-${i}"></div>
    `;
    grid.appendChild(card);
  });
}

function answerQ(i, chosen) {
  if (answered[i]) return;
  answered[i] = true;
  const q = questions[i];
  const card = document.getElementById("qcard-" + i);
  const fb = document.getElementById("qfb-" + i);
  const btns = document.querySelectorAll(`#qopts-${i} .opt-btn`);

  btns.forEach((b) => {
    b.disabled = true;
    if (b.textContent === q.answer) b.classList.add("correct-ans");
    if (b.textContent === chosen && chosen !== q.answer)
      b.classList.add("wrong-ans");
  });

  if (chosen === q.answer) {
    correct++;
    fb.textContent = "✅ Corect!";
    fb.className = "q-feedback ok";
    card.classList.add("answered-correct");
  } else {
    fb.textContent = "❌ " + q.hint;
    fb.className = "q-feedback err";
    card.classList.add("answered-wrong");
  }
  document.getElementById("score-num").textContent = correct;
}

function resetTask1() {
  buildTask1();
}

// ======================= ЗАДАНИЕ 2 =======================
function switchTab(type) {
  ["int", "float"].forEach((t) => {
    document
      .getElementById("panel-" + t)
      .classList.toggle("active", t === type);
  });
  const btnInt = document.querySelector(".tab-btn");
  const btnFloat = document.getElementById("tab-float");
  if (type === "int") {
    btnInt.className = "tab-btn active-int";
    btnFloat.className = "tab-btn";
  } else {
    btnInt.className = "tab-btn";
    btnFloat.className = "tab-btn active-float";
  }
}

function checkMath(inputId, expected, fbId, tolerance) {
  const input = document.getElementById(inputId);
  const fb = document.getElementById(fbId);
  const val = parseFloat(input.value.replace(",", "."));
  input.disabled = true;
  document.querySelector(
    `[onclick="checkMath('${inputId}',${expected},'${fbId}'${tolerance ? "," + tolerance : ""})"]`,
  ).disabled = true;

  const tol = tolerance || 0;
  if (!isNaN(val) && Math.abs(val - expected) <= tol) {
    input.classList.add("correct");
    fb.textContent = "✅ Corect!";
    fb.className = "answer-feedback ok";
  } else {
    input.classList.add("wrong");
    fb.textContent = `❌ Răspuns: ${expected}`;
    fb.className = "answer-feedback err";
  }
}

// ======================= ЗАДАНИЕ 3 =======================
const lifeAnswers = {
  1: ["int", "float", "char", "bool"],
  2: ["int", "float", "bool", "char"],
  3: ["int", "float", "bool", "char"],
};
let lifeSolved = { 1: false, 2: false, 3: false };

function checkLife(n) {
  const answers = lifeAnswers[n];
  const ids = [1, 2, 3, 4].map((k) => `bi_${n}_${k}`);
  let allCorrect = true;

  ids.forEach((id, idx) => {
    const input = document.getElementById(id);
    const blank = document.getElementById(`b_${n}_${idx + 1}`);
    const val = input.value.trim().toLowerCase();
    const expected = answers[idx].toLowerCase();
    input.disabled = true;

    blank.classList.remove("correct", "wrong");
    if (val === expected) {
      blank.classList.add("correct");
    } else {
      blank.classList.add("wrong");
      allCorrect = false;
    }
  });

  const result = document.getElementById("ltr" + n);
  if (allCorrect) {
    result.textContent = "✅ Totul corect! Excelent!";
    result.className = "lt-result ok";
    document.getElementById("lt" + n).classList.add("solved");
    if (!lifeSolved[n]) {
      lifeSolved[n] = true;
      updateProgress();
    }
  } else {
    const correctList = answers.join(", ");
    result.textContent = `❌ Corect: ${correctList}`;
    result.className = "lt-result err";
    // show correct answers
    ids.forEach((id, idx) => {
      const input = document.getElementById(id);
      const blank = document.getElementById(`b_${n}_${idx + 1}`);
      if (!blank.classList.contains("correct")) {
        input.value = answers[idx];
        blank.classList.remove("wrong");
        blank.classList.add("correct");
      }
    });
  }
}

function updateProgress() {
  const solved = Object.values(lifeSolved).filter(Boolean).length;
  document.getElementById("prog-bar").style.width = (solved / 3) * 100 + "%";
  document.getElementById("prog-text").textContent = solved + " / 3";
}

// Init
buildTask1();

// ======================= ЗАДАНИЕ 4 =======================
const prog4answers = ["int", "float", "char", "bool", "int", "2"];
// Ожидаемый вывод: Класс:B, Тетради:7, Вес:3.2, Домашка:1
const prog4output = ["B", "7", "3.2", "1"];

function checkProgram() {
  const ids = ["pbi1", "pbi2", "pbi3", "pbi4", "pbi5", "pbi6"];
  const blankIds = ["pb1", "pb2", "pb3", "pb4", "pb5", "pb6"];
  let allOk = true;

  ids.forEach((id, i) => {
    const input = document.getElementById(id);
    const blank = document.getElementById(blankIds[i]);
    const val = input.value.trim().toLowerCase();
    const expected = prog4answers[i].toLowerCase();
    blank.classList.remove("ok", "err");
    if (val === expected) {
      blank.classList.add("ok");
    } else {
      blank.classList.add("err");
      allOk = false;
    }
  });

  // Проверяем вывод программы
  const outIds = ["oi1", "oi2", "oi3", "oi4"];
  const outBlIds = ["op1", "op2", "op3", "op4"];
  outIds.forEach((id, i) => {
    const input = document.getElementById(id);
    const blank = document.getElementById(outBlIds[i]);
    const val = input.value.trim();
    blank.classList.remove("ok", "err");
    if (val === prog4output[i]) {
      blank.classList.add("ok");
    } else {
      blank.classList.add("err");
      allOk = false;
    }
  });

  const msg = document.getElementById("prog-task-msg");
  if (allOk) {
    msg.textContent = "✅ Totul corect! Excelent!";
    msg.className = "lt-result ok";
  } else {
    msg.textContent = "❌ Sunt greșeli — corectează câmpurile roșii";
    msg.className = "lt-result err";
  }
}

function resetProgram() {
  ["pbi1", "pbi2", "pbi3", "pbi4", "pbi5", "pbi6"].forEach((id) => {
    document.getElementById(id).value = "";
  });
  ["pb1", "pb2", "pb3", "pb4", "pb5", "pb6"].forEach((id) => {
    document.getElementById(id).classList.remove("ok", "err");
  });
  ["oi1", "oi2", "oi3", "oi4"].forEach((id) => {
    document.getElementById(id).value = "";
  });
  ["op1", "op2", "op3", "op4"].forEach((id) => {
    document.getElementById(id).classList.remove("ok", "err");
  });
  document.getElementById("prog-task-msg").textContent = "";
  document.getElementById("prog-task-msg").className = "lt-result";
}
// ======================= ЗАДАНИЕ 5: ЧЕК =======================
const chekAnswers = ["char", "int", "float", "bool"];
const chekExprVariants = ["pret * cantitate", "cantitate * pret"];
// Ожидаемый вывод: Отдел:М, Количество:4, Цена:67.5, Итого:270, Скидка:0
const chekOutput = ["M", "4", "67.5", "270", "0"];

function checkChek() {
  const typeIds = ["cbi1", "cbi2", "cbi3", "cbi4"];
  const blankIds = ["cb1", "cb2", "cb3", "cb4"];
  let allOk = true;

  typeIds.forEach((id, i) => {
    const input = document.getElementById(id);
    const blank = document.getElementById(blankIds[i]);
    const val = input.value.trim().toLowerCase();
    blank.classList.remove("ok", "err");
    if (val === chekAnswers[i]) {
      blank.classList.add("ok");
    } else {
      blank.classList.add("err");
      allOk = false;
    }
  });

  // check expression
  const exprInput = document.getElementById("cbi5");
  const exprBlank = document.getElementById("cb5");
  const exprVal = exprInput.value.trim().replace(/\s+/g, "").toLowerCase();
  exprBlank.classList.remove("ok", "err");
  const exprOk = chekExprVariants.some(
    (v) => v.replace(/\s+/g, "").toLowerCase() === exprVal,
  );
  if (exprOk) {
    exprBlank.classList.add("ok");
  } else {
    exprBlank.classList.add("err");
    allOk = false;
  }

  // Проверяем вывод программы
  const outIds = ["ci1", "ci2", "ci3", "ci4", "ci5o"];
  const outBlIds = ["cp1", "cp2", "cp3", "cp4", "cp5"];
  outIds.forEach((id, i) => {
    const input = document.getElementById(id);
    const blank = document.getElementById(outBlIds[i]);
    const val = input.value.trim();
    blank.classList.remove("ok", "err");
    if (val === chekOutput[i]) {
      blank.classList.add("ok");
    } else {
      blank.classList.add("err");
      allOk = false;
    }
  });

  const msg = document.getElementById("chek-msg");
  if (allOk) {
    msg.textContent = "✅ Totul corect! Excelent!";
    msg.className = "lt-result ok";
  } else {
    msg.textContent = "❌ Sunt greșeli — corectează câmpurile roșii";
    msg.className = "lt-result err";
  }
}

function resetChek() {
  ["cbi1", "cbi2", "cbi3", "cbi4", "cbi5"].forEach((id) => {
    document.getElementById(id).value = "";
  });
  ["cb1", "cb2", "cb3", "cb4", "cb5"].forEach((id) => {
    document.getElementById(id).classList.remove("ok", "err");
  });
  ["ci1", "ci2", "ci3", "ci4", "ci5o"].forEach((id) => {
    document.getElementById(id).value = "";
  });
  ["cp1", "cp2", "cp3", "cp4", "cp5"].forEach((id) => {
    document.getElementById(id).classList.remove("ok", "err");
  });
  document.getElementById("chek-msg").textContent = "";
  document.getElementById("chek-msg").className = "lt-result";
}
// ======================= НАВИГАЦИЯ =======================
let currentPage = 1;
const totalPages = 6;

function changePage(dir) {
  document.getElementById("page-" + currentPage).style.display = "none";
  currentPage += dir;
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;
  document.getElementById("page-" + currentPage).style.display = "block";

  document.getElementById("curr-page").textContent = currentPage;

  document.getElementById("prev-btn").style.display =
    currentPage === 1 ? "none" : "inline-block";
  document.getElementById("next-btn").style.display =
    currentPage === totalPages ? "none" : "inline-block";

  const hero = document.querySelector(".hero");
  if (hero) {
    hero.style.display = currentPage === 1 ? "block" : "none";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ======================= SUBMIT RESULTATE =======================
// Вставьте сюда URL вашего Google Web App после деплоя
const GOOGLE_APP_URL =
  "https://script.google.com/macros/s/AKfycbxcbOyPr1iR2fbGEb_CdpafHgjgV4Ig65HNAkj1lE9YCuxgtYXWELO1dwHp-tHBMo1wDw/exec";

function calculateTotalScore() {
  let score = correct; // Задание 1
  score += document.querySelectorAll(".answer-input.correct").length; // Задание 2
  score += document.querySelectorAll(".blank.correct").length; // Задание 3
  score += document.querySelectorAll(".blank2.ok").length; // Задания 4 и 5
  score += document.querySelectorAll(".oblank.ok").length; // Выводы 4 и 5
  return score;
}

const originalChangePage = changePage;
changePage = function (dir) {
  originalChangePage(dir);
  if (currentPage === 6) {
    document.getElementById("final-score").textContent = calculateTotalScore();
  }
};

async function submitResults() {
  const nume = document.getElementById("student-nume").value.trim();
  const prenume = document.getElementById("student-prenume").value.trim();
  const clasa = document.getElementById("student-clasa").value.trim();
  const msg = document.getElementById("submit-msg");
  const btn = document.getElementById("submit-btn");

  if (!nume || !prenume || !clasa) {
    msg.textContent = "❌ Completați toate câmpurile!";
    msg.style.color = "var(--wrong)";
    return;
  }

  if (GOOGLE_APP_URL === "URL_SKRIPTA") {
    msg.textContent = "⚠️ URL-ul Google Sheet nu este configurat în script.js!";
    msg.style.color = "#f59e0b";
    return;
  }

  btn.disabled = true;
  btn.textContent = "⏳ Se trimite...";
  msg.textContent = "";

  const score = calculateTotalScore();

  try {
    const response = await fetch(GOOGLE_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nume: nume,
        prenume: prenume,
        clasa: clasa,
        punctaj: score,
      }),
    });

    msg.textContent = "✅ Rezultatele au fost trimise cu succes!";
    msg.style.color = "var(--correct)";
    btn.textContent = "Trimis!";
  } catch (error) {
    msg.textContent = "❌ Eroare la trimitere. Încercați din nou.";
    msg.style.color = "var(--wrong)";
    btn.disabled = false;
    btn.textContent = "📤 Trimite rezultatele";
  }
}
