// ===============================
// CONFIGURATION DES RÉGIMENTS
// ===============================

const REGIMENTS = {

    "41st": {
        constructions: [

            {
                nom: "Construction Alpha",
                contenu: `FICHE DE CONSTRUCTION
========================

Construction Alpha

Matériel nécessaire :
- Élément 1
- Élément 2
- Élément 3

Procédure :
1. Première étape.
2. Deuxième étape.
3. Troisième étape.

Vérifications :
- Vérifier la sécurité.
- Vérifier la stabilité.
- Vérifier que la construction est terminée.`
            },

            {
                nom: "Construction Bravo",
                contenu: `FICHE DE CONSTRUCTION
========================

Construction Bravo

Matériel nécessaire :
- Élément 1
- Élément 2

Procédure :
1. Première étape.
2. Deuxième étape.
3. Vérification finale.

Vérifications :
- Vérifier la sécurité.
- Vérifier la stabilité.`
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
========================

Construction Delta

Matériel nécessaire :
- Élément 1
- Élément 2
- Élément 3

Procédure :
1. Première étape.
2. Deuxième étape.
3. Troisième étape.

Vérifications :
- Vérifier la sécurité.
- Vérifier la stabilité.`
            },

            {
                nom: "Construction Echo",
                contenu: `FICHE DE CONSTRUCTION
========================

Construction Echo

Matériel nécessaire :
- Élément 1
- Élément 2

Procédure :
1. Première étape.
2. Deuxième étape.
3. Vérification finale.`
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


// ===============================
// DONNÉES THÉORIQUES
// ===============================

const THEORIE = [
    {
        titre: "Introduction",
        contenu: "Présentation générale du régiment et de ses missions."
    },

    {
        titre: "Organisation",
        contenu: "Organisation interne, rôles et responsabilités."
    },

    {
        titre: "Procédures",
        contenu: "Procédures générales à respecter."
    }
];


// ===============================
// OUTILS
// ===============================

function q(id) {
    return document.getElementById(id);
}


function esc(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ===============================
// REMPLIR UN SELECT
// ===============================

function fillSelect(select, values) {

    if (!select) return;

    select.innerHTML = "";

    values.forEach(value => {

        const option = document.createElement("option");

        option.value = value;
        option.textContent = value;

        select.appendChild(option);
    });
}


// ===============================
// PAGE CONSTRUCTION
// ===============================

function renderConstruction() {

    const select = q("constructionRegiment");
    const container = q("constructionList");

    if (!select || !container) return;

    const regiment = select.value;
    const data = REGIMENTS[regiment];

    container.innerHTML = "";

    if (!data) return;


    // Titre du régiment

    const title = document.createElement("h2");

    title.textContent = regiment;

    container.appendChild(title);


    // Création des constructions

    data.constructions.forEach((construction, i) => {

        const element = document.createElement("div");

        element.className = "item";

        element.innerHTML = `
            <strong>Construction ${i + 1}</strong>
            <br>

            <span class="muted">
                ${esc(construction.nom)}
            </span>

            <br><br>

            <button type="button">
                ⬇️ Télécharger
            </button>
        `;


        // Bouton téléchargement

        const button = element.querySelector("button");

        button.addEventListener("click", () => {

            downloadFile(
                construction.nom,
                construction.contenu
            );

        });


        container.appendChild(element);

    });
}


// ===============================
// TÉLÉCHARGEMENT D'UNE CONSTRUCTION
// ===============================

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

    link.download = `${nom}.txt`;


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);
}


// ===============================
// PAGE NOTATION
// ===============================

function renderNotation() {

    const select = q("notationRegiment");
    const container = q("notationList");

    if (!select || !container) return;

    const regiment = select.value;
    const data = REGIMENTS[regiment];

    container.innerHTML = "";

    if (!data) return;


    const title = document.createElement("h2");

    title.textContent = regiment;

    container.appendChild(title);


    data.notation.forEach((critere, index) => {

        const element = document.createElement("div");

        element.className = "item";


        element.innerHTML = `
            <strong>
                ${esc(critere.nom)}
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
                data-index="${index}"
                class="notation-input"
            >
        `;


        container.appendChild(element);

    });


    calculateNotation();

    const inputs = container.querySelectorAll(".notation-input");


    inputs.forEach(input => {

        input.addEventListener(
            "input",
            calculateNotation
        );

    });

}


// ===============================
// CALCUL DE LA NOTE
// ===============================

function calculateNotation() {

    const select = q("notationRegiment");
    const container = q("notationList");
    const result = q("notationResult");

    if (!select || !container || !result) return;


    const regiment = select.value;
    const data = REGIMENTS[regiment];

    if (!data) return;


    const inputs =
        container.querySelectorAll(".notation-input");


    let total = 0;
    let coefficients = 0;


    data.notation.forEach((critere, index) => {

        const input = inputs[index];

        if (!input) return;


        let note = Number(input.value);


        if (isNaN(note)) {
            note = 0;
        }


        // Empêche une note négative

        if (note < 0) {
            note = 0;
            input.value = 0;
        }


        // Empêche de dépasser le maximum

        if (note > critere.max) {
            note = critere.max;
            input.value = critere.max;
        }


        total += note * critere.coefficient;

        coefficients += critere.coefficient;

    });


    let finalScore = 0;


    if (coefficients > 0) {

        finalScore =
            total / coefficients;

    }


    result.textContent =
        `Note finale : ${finalScore.toFixed(2)} / 20`;

}


// ===============================
// PAGE THÉORIQUE
// ===============================

function renderTheorie() {

    const container = q("theorieList");

    if (!container) return;

    container.innerHTML = "";


    THEORIE.forEach(section => {

        const element =
            document.createElement("div");


        element.className = "item";


        element.innerHTML = `
            <strong>
                ${esc(section.titre)}
            </strong>

            <br><br>

            <span class="muted">
                ${esc(section.contenu)}
            </span>
        `;


        container.appendChild(element);

    });

}


// ===============================
// INITIALISATION
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        // ---------------------------
        // Construction
        // ---------------------------

        const constructionSelect =
            q("constructionRegiment");


        if (constructionSelect) {

            fillSelect(
                constructionSelect,
                Object.keys(REGIMENTS)
            );


            constructionSelect.addEventListener(
                "change",
                renderConstruction
            );


            renderConstruction();

        }


        // ---------------------------
        // Notation
        // ---------------------------

        const notationSelect =
            q("notationRegiment");


        if (notationSelect) {

            fillSelect(
                notationSelect,
                Object.keys(REGIMENTS)
            );


            notationSelect.addEventListener(
                "change",
                renderNotation
            );


            renderNotation();

        }


        // ---------------------------
        // Théorie
        // ---------------------------

        renderTheorie();

    }
);
