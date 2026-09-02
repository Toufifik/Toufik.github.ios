const REGIMENTS = {
    "41st": {
        constructions: [
            "Construction Alpha",
            "Construction Bravo"
        ],
        notation: [
            {
                nom: "Traque",
                coefficient: 2,
                max: 20
            },
            {
                nom: "Reconnaissance",
                coefficient: 3,
                max: 20
            }
        ]
    },

    "65st": {
        constructions: [
            "Construction Delta",
            "Construction Echo"
        ],
        notation: [
            {
                nom: "Extraction VIP",
                coefficient: 3,
                max: 20
            },
            {
                nom: "CQB",
                coefficient: 4,
                max: 20
            }
        ]
    }
};


// ================================
// PAGE CONSTRUCTION
// ================================

function renderConstruction() {

    const select = document.getElementById("constructionRegiment");
    const list = document.getElementById("constructionList");

    if (!select || !list) return;

    const regiment = select.value;

    const data = REGIMENTS[regiment];

    if (!data) return;

    list.innerHTML = "";

    data.constructions.forEach((construction, index) => {

        const div = document.createElement("div");

        div.className = "item";

        div.innerHTML = `
            <strong>Construction ${index + 1}</strong>
            <br>
            <span class="muted">${construction}</span>
            <br><br>

            <button type="button" onclick="downloadConstruction('${construction}')">
                ⬇️ Télécharger
            </button>
        `;

        list.appendChild(div);
    });
}


// ================================
// TÉLÉCHARGEMENT
// ================================

function downloadConstruction(nom) {

    const contenu =
`FICHE DE CONSTRUCTION

${nom}

================================

Matériel nécessaire :

- À compléter
- À compléter
- À compléter

Procédure :

1. À compléter
2. À compléter
3. À compléter

Notes :

À compléter
`;


    const fichier = new Blob(
        [contenu],
        {
            type: "text/plain;charset=utf-8"
        }
    );

    const url = URL.createObjectURL(fichier);

    const lien = document.createElement("a");

    lien.href = url;
    lien.download = nom + ".txt";

    document.body.appendChild(lien);

    lien.click();

    document.body.removeChild(lien);

    URL.revokeObjectURL(url);
}


// ================================
// PAGE NOTATION
// ================================

function renderNotation() {

    const select = document.getElementById("notationRegiment");
    const list = document.getElementById("notationList");

    if (!select || !list) return;

    const regiment = select.value;

    const data = REGIMENTS[regiment];

    if (!data) return;

    list.innerHTML = "";

    data.notation.forEach((critere) => {

        const div = document.createElement("div");

        div.className = "item";

        div.innerHTML = `
            <strong>${critere.nom}</strong>
            <br>
            <span class="muted">
                Coefficient : ${critere.coefficient}
            </span>
            <br><br>

            <label>
                Note / ${critere.max}
            </label>

            <input
                type="number"
                min="0"
                max="${critere.max}"
                value="0"
                class="notation-input"
            >
        `;

        list.appendChild(div);
    });

    calculateNotation();

    list.querySelectorAll(".notation-input").forEach(input => {

        input.addEventListener("input", calculateNotation);

    });
}


// ================================
// CALCUL NOTE
// ================================

function calculateNotation() {

    const select = document.getElementById("notationRegiment");
    const list = document.getElementById("notationList");
    const result = document.getElementById("notationResult");

    if (!select || !list || !result) return;

    const data = REGIMENTS[select.value];

    if (!data) return;

    const inputs =
        list.querySelectorAll(".notation-input");

    let total = 0;
    let totalCoefficient = 0;

    data.notation.forEach((critere, index) => {

        let note = Number(inputs[index].value);

        if (isNaN(note)) {
            note = 0;
        }

        if (note < 0) {
            note = 0;
        }

        if (note > critere.max) {
            note = critere.max;
        }

        total += note * critere.coefficient;

        totalCoefficient += critere.coefficient;
    });

    const score =
        totalCoefficient > 0
            ? total / totalCoefficient
            : 0;

    result.textContent =
        "Note finale : " + score.toFixed(2) + " / 20";
}


// ================================
// INITIALISATION
// ================================

document.addEventListener("DOMContentLoaded", function () {

    // Sélection construction

    const constructionSelect =
        document.getElementById("constructionRegiment");

    if (constructionSelect) {

        constructionSelect.innerHTML = `
            <option value="41st">41st</option>
            <option value="65st">65st</option>
        `;

        constructionSelect.addEventListener(
            "change",
            renderConstruction
        );

        renderConstruction();
    }


    // Sélection notation

    const notationSelect =
        document.getElementById("notationRegiment");

    if (notationSelect) {

        notationSelect.innerHTML = `
            <option value="41st">41st</option>
            <option value="65st">65st</option>
        `;

        notationSelect.addEventListener(
            "change",
            renderNotation
        );

        renderNotation();
    }

});
