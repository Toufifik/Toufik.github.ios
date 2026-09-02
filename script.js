const REGIMENTS = {
    "41st": {
        constructions: [
            {
                nom: "Construction Alpha",
                contenu: `FICHE DE CONSTRUCTION

Construction Alpha

Matériel nécessaire :
- À compléter
- À compléter
- À compléter

Procédure :
1. À compléter
2. À compléter
3. À compléter

Notes :
À compléter`
            },

            {
                nom: "Construction Bravo",
                contenu: `FICHE DE CONSTRUCTION

Construction Bravo

Matériel nécessaire :
- À compléter
- À compléter

Procédure :
1. À compléter
2. À compléter
3. À compléter`
            }
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
            {
                nom: "Construction Delta",
                contenu: `FICHE DE CONSTRUCTION

Construction Delta

Matériel nécessaire :
- À compléter
- À compléter

Procédure :
1. À compléter
2. À compléter
3. À compléter`
            },

            {
                nom: "Construction Echo",
                contenu: `FICHE DE CONSTRUCTION

Construction Echo

Matériel nécessaire :
- À compléter
- À compléter

Procédure :
1. À compléter
2. À compléter
3. À compléter`
            }
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


// =====================================
// CONSTRUCTION
// =====================================

function renderConstruction() {

    const select = document.getElementById("regimentSelect");
    const list = document.getElementById("constructionList");
    const title = document.getElementById("selectedRegiment");

    if (!select || !list || !title) {
        return;
    }

    const regiment = select.value;

    list.innerHTML = "";

    if (!regiment) {
        title.textContent = "Aucun régiment sélectionné";
        return;
    }

    const data = REGIMENTS[regiment];

    if (!data) {
        return;
    }

    title.textContent = regiment;


    data.constructions.forEach((construction, index) => {

        const element = document.createElement("div");

        element.className = "item";

        element.innerHTML = `
            <strong>Construction ${index + 1}</strong>

            <br>

            <span class="muted">
                ${construction.nom}
            </span>

            <br><br>

            <button type="button" class="download-button">
                ⬇️ Télécharger
            </button>
        `;


        const button =
            element.querySelector(".download-button");


        button.addEventListener("click", function () {

            downloadFile(
                construction.nom,
                construction.contenu
            );

        });


        list.appendChild(element);
    });
}


// =====================================
// TÉLÉCHARGEMENT
// =====================================

function downloadFile(nom, contenu) {

    const blob = new Blob(
        [contenu],
        {
            type: "text/plain;charset=utf-8"
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = nom + ".txt";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}


// =====================================
// NOTATION
// =====================================

function renderNotation() {

    const select =
        document.getElementById("notationRegiment");

    const list =
        document.getElementById("notationList");

    if (!select || !list) {
        return;
    }

    const regiment = select.value;

    const data = REGIMENTS[regiment];

    if (!data) {
        return;
    }

    list.innerHTML = "";


    data.notation.forEach((critere, index) => {

        const element =
            document.createElement("div");

        element.className = "item";

        element.innerHTML = `
            <strong>
                ${critere.nom}
            </strong>

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

        list.appendChild(element);
    });


    calculateNotation();


    list.querySelectorAll(".notation-input")
        .forEach(input => {

            input.addEventListener(
                "input",
                calculateNotation
            );

        });
}


// =====================================
// CALCUL NOTE
// =====================================

function calculateNotation() {

    const select =
        document.getElementById("notationRegiment");

    const list =
        document.getElementById("notationList");

    const result =
        document.getElementById("notationResult");

    if (!select || !list || !result) {
        return;
    }

    const data = REGIMENTS[select.value];

    if (!data) {
        return;
    }

    const inputs =
        list.querySelectorAll(".notation-input");

    let total = 0;

    let totalCoefficient = 0;


    data.notation.forEach((critere, index) => {

        let note =
            Number(inputs[index].value);

        if (isNaN(note)) {
            note = 0;
        }

        if (note < 0) {
            note = 0;
        }

        if (note > critere.max) {
            note = critere.max;
        }

        total +=
            note * critere.coefficient;

        totalCoefficient +=
            critere.coefficient;
    });


    const score =
        totalCoefficient > 0
            ? total / totalCoefficient
            : 0;


    result.textContent =
        "Note finale : " +
        score.toFixed(2) +
        " / 20";
}


// =====================================
// INITIALISATION
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // =============================
        // CONSTRUCTION
        // =============================

        const constructionSelect =
            document.getElementById("regimentSelect");


        if (constructionSelect) {

            constructionSelect.innerHTML = `
                <option value="">
                    — Sélectionner un régiment —
                </option>

                <option value="41st">
                    41st
                </option>

                <option value="65st">
                    65st
                </option>
            `;


            constructionSelect.addEventListener(
                "change",
                renderConstruction
            );

        }


        // =============================
        // NOTATION
        // =============================

        const notationSelect =
            document.getElementById("notationRegiment");


        if (notationSelect) {

            notationSelect.innerHTML = `
                <option value="41st">
                    41st
                </option>

                <option value="65st">
                    65st
                </option>
            `;


            notationSelect.addEventListener(
                "change",
                renderNotation
            );


            renderNotation();
        }

    }
);
