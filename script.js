// ============================================================
// CONFIGURATION DES RÉGIMENTS
// Ajoute/modifie les régiments et leurs critères ici.
// coefficient = poids du critère dans la note finale.
// max = note maximale possible pour ce critère.
// ============================================================

const REGIMENTS = {
  "41st": [
    { name: "Traque", coefficient: 2, max: 20 },
    { name: "Reconnaissance", coefficient: 3, max: 20 }
  ],

  "65st": [
    { name: "Extraction VIP", coefficient: 3, max: 20 },
    { name: "CQB", coefficient: 4, max: 20 }
  ],

  "75th": [
    { name: "Assaut", coefficient: 3, max: 20 },
    { name: "Tactique", coefficient: 2, max: 20 },
    { name: "Coordination", coefficient: 1, max: 20 }
  ]
};

  // Exemple :
  // "Régiment X": [
  //   { name: "Critère 1", max: 20 },
  //   { name: "Critère 2", max: 10 }
  // ]
};

const regimentSelect = document.getElementById("regiment");
const evaluation = document.getElementById("evaluation");
const emptyState = document.getElementById("emptyState");
const criteriaList = document.getElementById("criteriaList");
const regimentTitle = document.getElementById("regimentTitle");
const finalScore = document.getElementById("finalScore");
const resetBtn = document.getElementById("resetBtn");

function loadRegiments() {
  Object.keys(REGIMENTS).forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    regimentSelect.appendChild(option);
  });
}

function renderEvaluation(regimentName) {
  const criteria = REGIMENTS[regimentName];

  if (!criteria) {
    evaluation.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  }

  evaluation.classList.remove("hidden");
  emptyState.classList.add("hidden");
  regimentTitle.textContent = regimentName;
  criteriaList.innerHTML = "";

  criteria.forEach((criterion, index) => {
    const row = document.createElement("div");
    row.className = "criteria-row";

    row.innerHTML = `
      <div>
        <div class="criterion-name">${escapeHtml(criterion.name)}</div>
        <div class="criterion-meta">Note maximale : ${criterion.max}/20</div>
      </div>

      <div class="coefficient">
        Coef. <strong>×${criterion.coefficient}</strong>
      </div>

      <input
        class="note-input"
        type="number"
        min="0"
        max="${criterion.max}"
        step="0.5"
        placeholder="0"
        data-index="${index}"
        aria-label="Note pour ${escapeHtml(criterion.name)}"
      >
    `;

    criteriaList.appendChild(row);
  });

  criteriaList.querySelectorAll(".note-input").forEach((input) => {
    input.addEventListener("input", calculateScore);
  });

  calculateScore();
}

function calculateScore() {
  const regimentName = regimentSelect.value;
  const criteria = REGIMENTS[regimentName];

  if (!criteria) {
    finalScore.textContent = "—";
    return;
  }

  const inputs = criteriaList.querySelectorAll(".note-input");
  let weightedTotal = 0;
  let coefficientTotal = 0;

  criteria.forEach((criterion, index) => {
    const raw = Number(inputs[index]?.value);
    const note = Number.isFinite(raw) ? Math.max(0, Math.min(raw, criterion.max)) : 0;

    // Conversion vers une base /20, puis application du coefficient.
    const noteSur20 = (note / criterion.max) * 20;
    weightedTotal += noteSur20 * criterion.coefficient;
    coefficientTotal += criterion.coefficient;
  });

  const score = coefficientTotal ? weightedTotal / coefficientTotal : 0;
  finalScore.textContent = `${score.toFixed(2)}/20`;
}

function resetNotes() {
  criteriaList.querySelectorAll(".note-input").forEach((input) => {
    input.value = "";
  });
  calculateScore();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

regimentSelect.addEventListener("change", (event) => {
  renderEvaluation(event.target.value);
});

resetBtn.addEventListener("click", resetNotes);

loadRegiments();
