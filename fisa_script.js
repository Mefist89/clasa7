// ======================= EXERCISE 1 (DATA TYPES) =======================
const types = ["int", "float", "char", "bool"];
const cesQuestions = [
  { ctx: "Un număr întreg (vârsta: 10 ani)", val: "10", answer: "int", hint: "Numerele simple sunt întregi: int" },
  { ctx: "Număr cu punct (preț: 2.5 lei)", val: "2.5", answer: "float", hint: "Dacă are punct zecimal e float" },
  { ctx: "O singură literă (nota: 'A')", val: "'A'", answer: "char", hint: "Literele sunt de tip char" },
  { ctx: "Adevărat (Da)", val: "true", answer: "bool", hint: "Adevărat / Fals sunt logică: bool" }
];

let answered = {};

function buildCesTask() {
  const grid = document.getElementById('ces-q-grid');
  if(!grid) return;
  grid.innerHTML = '';

  cesQuestions.forEach((q, i) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = 'qcard-' + i;

    const opts = types.map(t =>
      `<button class="opt-btn ${t}" onclick="answerQ(${i},'${t}')">${t}</button>`
    ).join('');

    card.innerHTML = `
      <div class="q-situation" style="font-size:15px; font-weight:bold; color:var(--text); margin-bottom:10px;">${q.ctx}</div>
      <div class="q-value" style="font-size:24px; margin-bottom:15px; color:#60a5fa;">${q.val}</div>
      <div class="q-options" id="qopts-${i}">${opts}</div>
      <div class="q-feedback" id="qfb-${i}" style="font-size:15px; margin-top:15px;"></div>
    `;
    grid.appendChild(card);
  });
}

function answerQ(i, chosen) {
  if (answered[i]) return;
  const q = cesQuestions[i];
  const card = document.getElementById('qcard-' + i);
  const fb = document.getElementById('qfb-' + i);
  const btns = document.querySelectorAll(`#qopts-${i} .opt-btn`);

  // Highlighting selected logic
  if (chosen === q.answer) {
    answered[i] = true;
    btns.forEach(b => {
      b.disabled = true;
      if (b.textContent === chosen) b.classList.add('correct-ans');
    });
    fb.textContent = '✅ Corect! Bravo!';
    fb.className = 'q-feedback ok';
    card.classList.add('answered-correct');
  } else {
    // Only highlight the wrong one, encourage to try again
    fb.textContent = '❌ ' + q.hint + ' (Mai încearcă!)';
    fb.className = 'q-feedback err';
  }
}

// ======================= EXERCISE 2 & 3 (MATH) =======================
function checkMath(inputId, expected, fbId) {
  const input = document.getElementById(inputId);
  const fb = document.getElementById(fbId);
  const val = parseFloat(input.value.replace(',', '.'));

  if (!isNaN(val) && Math.abs(val - expected) < 0.01) {
    input.classList.add('correct');
    input.classList.remove('wrong');
    fb.textContent = '✅ Corect!';
    fb.className = 'answer-feedback ok';
    input.disabled = true;
  } else {
    input.classList.add('wrong');
    input.classList.remove('correct');
    fb.textContent = '❌ Mai încearcă! (Ajutor: Răspunsul este ' + expected + ')';
    fb.className = 'answer-feedback err';
  }
}

// Init
buildCesTask();

// ======================= NAVIGARE =======================
let currentPage = 1;
const totalPages = 4;

function changePage(dir) {
  document.getElementById('page-' + currentPage).style.display = 'none';
  currentPage += dir;
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;
  document.getElementById('page-' + currentPage).style.display = 'block';
  
  document.getElementById('curr-page').textContent = currentPage;
  
  document.getElementById('prev-btn').style.display = (currentPage === 1) ? 'none' : 'inline-block';
  document.getElementById('next-btn').style.display = (currentPage === totalPages) ? 'none' : 'inline-block';
  
  const hero = document.querySelector('.hero');
  if (hero) {
      hero.style.display = (currentPage === 1) ? 'block' : 'none';
  }
  
  window.scrollTo({top: 0, behavior: 'smooth'});
}
