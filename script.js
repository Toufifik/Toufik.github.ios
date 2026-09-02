// =====================================================
// RÉGIMENTS
// =====================================================

const REGIMENTS = {
  "41st": {
    constructions: [
      "Construction Alpha",
      "Construction Bravo"
    ],

    notation: [
      { nom: "Traque", coefficient: 2, max: 20 },
      { nom: "Reconnaissance", coefficient: 3, max: 20 }
    ]
  },

  "65st": {
    constructions: [
      "Construction Delta",
      "Construction Echo"
    ],

    notation: [
      { nom: "Extraction VIP", coefficient: 3, max: 20 },
      { nom: "CQB", coefficient: 4, max: 20 }
    ]
  }
};


// =====================================================
// DOCUMENTS THÉORIQUES
// =====================================================

const THEORIE = [
  {
    titre: "Introduction",
    texte: "Ajoute ici ton document théorique et les notions à connaître."
  },

  {
    titre: "Procédures",
    texte: "Ajoute ici les procédures générales et consignes."
  },

  {
    titre: "Préparation",
    texte: "Ajoute ici les éléments à vérifier avant une évaluation."
  }
];


// =====================================================
// OUTILS
// =====================================================

function q(id) {
  return document.getElementById(id);
}


function esc(v) {
  return String(v)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// =====================================================
// LISTE DES RÉGIMENTS
// =====================================================

function fillSelect(select) {

  if (!select) return;

  Object.keys(REGIMENTS).forEach(name => {

    const option = document.createElement("option");

    option.value = name;
    option.textContent = name;

    select.appendChild(option);

  });
}


// =====================================================
// CONSTRUCTIONS
// =====================================================

function renderConstruction() {

  const select = q("regimentSelect");
  const list = q("constructionList");
  const title = q("selectedRegiment");

  if (!select || !list) return;

  list.innerHTML = "";

  const regiment = select.value;

  if (!regiment) {

    title.textContent = "Aucun régiment sélectionné";

    return;
  }

  title.textContent = regiment;

  const constructions = REGIMENTS[regiment].constructions;

  constructions.forEach((construction, index) => {

    const element = document.createElement("div");

    element.className = "item";

    element.innerHTML = `
      <strong>Construction ${index + 1}</strong>

      <br>

      <span class="muted">
        ${esc(construction)}
      </span>

      <br><br>

      <button onclick="downloadFile('${esc(construction)}')">
        ⬇️ Télécharger
      </button>
    `;

    list.appendChild(element);

  });

}


// =====================================================
// TÉLÉCHARGEMENT
// =====================================================

function downloadFile(text) {

  const contenu = text;

  const blob = new Blob(
    [contenu],
    {
      type: "text/plain;charset=utf-8"
    }
  );

  const url = URL.createObjectURL(blob);

  const lien = document.createElement("a");

  lien.href = url;

  lien.download = text + ".txt";

  document.body.appendChild(lien);

  lien.click();

  lien.remove();

  URL.revokeObjectURL(url);

}


// =====================================================
// NOTATION
// =====================================================

function renderNotation() {

  const select = q("regimentSelect");
  const list = q("criteriaList");
  const title = q("selectedRegiment");
  const finalScore = q("finalScore");

  if (!select || !list) return;

  list.innerHTML = "";

  const regiment = select.value;

  if (!regiment) {

    title.textContent = "Aucun régiment sélectionné";

    finalScore.textContent = "—";

    return;
  }

  title.textContent = regiment;

  const criteria = REGIMENTS[regiment].notation;

  criteria.forEach((criterion, index) => {

    const element = document.createElement("div");

    element.className = "row";

    element.innerHTML = `
      <div>
        <strong>
          ${esc(criterion.nom)}
        </strong>

        <div class="muted">
          Maximum : ${criterion.max}/20
        </div>
      </div>

      <div class="coeff">
        Coef. ×${criterion.coefficient}
      </div>

      <input
        class="score"
        type="number"
        min="0"
        max="${criterion.max}"
        step="0.5"
        data-index="${index}"
        placeholder="0"
      >
    `;

    list.appendChild(element);

  });

  list
    .querySelectorAll("input")
    .forEach(input => {

      input.addEventListener("input", calculateScore);

    });

  calculateScore();

}


// =====================================================
// CALCUL DE LA NOTE
// =====================================================

function calculateScore() {

  const select = q("regimentSelect");
  const finalScore = q("finalScore");

  if (
    !select ||
    !finalScore ||
    !REGIMENTS[select.value]
  ) {
    return;
  }

  const criteria =
    REGIMENTS[select.value].notation;

  const inputs =
    document.querySelectorAll(
      "#criteriaList input"
    );

  let total = 0;

  let totalCoefficients = 0;


  criteria.forEach((criterion, index) => {

    const note = Math.max(
      0,
      Math.min(
        Number(inputs[index]?.value) || 0,
        criterion.max
      )
    );

    const noteSur20 =
      (note / criterion.max) * 20;

    total +=
      noteSur20 * criterion.coefficient;

    totalCoefficients +=
      criterion.coefficient;

  });


  const result =
    totalCoefficients
      ? total / totalCoefficients
      : 0;


  finalScore.textContent =
    result.toFixed(2) + "/20";

}


// =====================================================
// DOCUMENT THÉORIQUE
// =====================================================

function renderTheory() {

  const list = q("theoryList");

  if (!list) return;

  THEORIE.forEach(document => {

    const element =
      document.createElement("article");

    element.className = "item";

    element.innerHTML = `
      <h3>
        ${esc(document.titre)}
      </h3>

      <p>
        ${esc(document.texte)}
      </p>
    `;

    list.appendChild(element);

  });

}


// =====================================================
// INITIALISATION
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const select =
      q("regimentSelect");

    fillSelect(select);


    if (select) {

      select.addEventListener(
        "change",
        () => {

          if (q("constructionList")) {

            renderConstruction();

          }

          if (q("criteriaList")) {

            renderNotation();

          }

        }
      );

    }


    if (q("constructionList")) {

      renderConstruction();

    }


    if (q("criteriaList")) {

      renderNotation();

    }


    renderTheory();

  }
);
