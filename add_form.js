const fs = require("fs");
const dir = "c:\\Users\\User\\Desktop\\web\\c++";
let html = fs.readFileSync(dir + "\\index.html", "utf8");

// Update pagination indicator /5 to /6
html = html.replace(
  '<span id="curr-page">1</span> / 5',
  '<span id="curr-page">1</span> / 6',
);

// Add page 6 before <div class="pagination">
const page6HTML = `
  <div class="page" id="page-6" style="display:none;">
    <div class="task-block" style="text-align: center;">
      <div class="task-header" style="justify-content: center; flex-direction: column; gap: 10px;">
        <span class="task-badge" style="background:linear-gradient(135deg,#10b981,#34d399); font-size:16px;">FINALIZARE</span>
        <span class="task-title" style="font-size: 24px;">Trimite Rezultatele</span>
      </div>
      <p class="task-desc">Ai terminat toate exercițiile! Introdu datele tale pentru a trimite punctajul profesorului.</p>
      
      <div class="form-container" style="max-width: 400px; margin: 0 auto; text-align: left;">
        <div class="score-summary" style="background: var(--surface2); padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center; border: 2px solid #6366f1;">
          <span style="font-size: 14px; color: var(--text-muted);">Punctaj acumulat:</span><br>
          <span id="final-score" style="font-size: 32px; font-weight: 900; color: #60a5fa;">0</span> <span style="font-size: 16px;">puncte</span>
        </div>
        
        <label class="form-label">Nume:</label>
        <input type="text" id="student-nume" class="form-input" placeholder="ex: Ionescu">
        
        <label class="form-label">Prenume:</label>
        <input type="text" id="student-prenume" class="form-input" placeholder="ex: Andrei">
        
        <label class="form-label">Clasa:</label>
        <input type="text" id="student-clasa" class="form-input" placeholder="ex: 7A">
        
        <button id="submit-btn" class="submit-btn" onclick="submitResults()">📤 Trimite rezultatele</button>
        <div id="submit-msg" class="submit-msg"></div>
      </div>
    </div>
  </div>
`;

// Prevent adding multiple times if retried
if (!html.includes('id="page-6"')) {
  html = html.replace(
    "  <!-- НАВИГАЦИЯ -->",
    page6HTML + "\n  <!-- НАВИГАЦИЯ -->",
  );
  fs.writeFileSync(dir + "\\index.html", html);
}

// Add CSS
let css = fs.readFileSync(dir + "\\style.css", "utf8");
if (!css.includes(".form-input")) {
  css += `
/* FORM CSS */
.form-label {
  display: block;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
  color: var(--text-muted);
}
.form-input {
  width: 100%;
  background: #0d1117;
  border: 2px solid #334155;
  border-radius: 8px;
  padding: 12px 14px;
  color: var(--text);
  font-family: 'Nunito', sans-serif;
  font-size: 16px;
  margin-bottom: 16px;
  outline: none;
  transition: border-color 0.2s;
}
.form-input:focus { border-color: #6366f1; }
.submit-btn {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-family: 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  margin-top: 10px;
}
.submit-btn:hover { opacity: 0.9; }
.submit-btn:active { transform: scale(0.98); }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.submit-msg { margin-top: 15px; text-align: center; font-weight: 700; font-size: 14px; min-height: 20px; }
`;
  fs.writeFileSync(dir + "\\style.css", css);
}

// Add JS
let js = fs.readFileSync(dir + "\\script.js", "utf8");
if (!js.includes("GOOGLE_APP_URL")) {
  js = js.replace("const totalPages = 5;", "const totalPages = 6;");

  const jsCode = `
// ======================= SUBMIT RESULTATE =======================
// Вставьте сюда URL вашего Google Web App после деплоя
const GOOGLE_APP_URL = "URL_SKRIPTA"; 

function calculateTotalScore() {
  let score = correct; // Задание 1
  score += document.querySelectorAll('.answer-input.correct').length; // Задание 2
  score += document.querySelectorAll('.blank.correct').length; // Задание 3
  score += document.querySelectorAll('.blank2.ok').length; // Задания 4 и 5
  score += document.querySelectorAll('.oblank.ok').length; // Выводы 4 и 5
  return score;
}

const originalChangePage = changePage;
changePage = function(dir) {
  originalChangePage(dir);
  if (currentPage === 6) {
    document.getElementById('final-score').textContent = calculateTotalScore();
  }
};

async function submitResults() {
  const nume = document.getElementById('student-nume').value.trim();
  const prenume = document.getElementById('student-prenume').value.trim();
  const clasa = document.getElementById('student-clasa').value.trim();
  const msg = document.getElementById('submit-msg');
  const btn = document.getElementById('submit-btn');
  
  if (!nume || !prenume || !clasa) {
    msg.textContent = '❌ Completați toate câmpurile!';
    msg.style.color = 'var(--wrong)';
    return;
  }
  
  if (GOOGLE_APP_URL === "URL_SKRIPTA") {
    msg.textContent = '⚠️ URL-ul Google Sheet nu este configurat în script.js!';
    msg.style.color = '#f59e0b';
    return;
  }

  btn.disabled = true;
  btn.textContent = '⏳ Se trimite...';
  msg.textContent = '';
  
  const score = calculateTotalScore();
  
  try {
    const response = await fetch(GOOGLE_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nume: nume,
        prenume: prenume,
        clasa: clasa,
        punctaj: score
      })
    });
    
    msg.textContent = '✅ Rezultatele au fost trimise cu succes!';
    msg.style.color = 'var(--correct)';
    btn.textContent = 'Trimis!';
    
  } catch (error) {
    msg.textContent = '❌ Eroare la trimitere. Încercați din nou.';
    msg.style.color = 'var(--wrong)';
    btn.disabled = false;
    btn.textContent = '📤 Trimite rezultatele';
  }
}
`;
  js += jsCode;
  fs.writeFileSync(dir + "\\script.js", js);
}
