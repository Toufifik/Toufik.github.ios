const REGIMENTS = {
    "41st": {
        constructions: [
            {
                nom: "Construction Alpha",
                contenu: `FICHE DE CONSTRUCTION

Construction Alpha

Matériel nécessaire :
- Exemple 1
- Exemple 2
- Exemple 3

Procédure :
1. Première étape
2. Deuxième étape
3. Troisième étape

Notes :
- Vérifier la sécurité
- Vérifier la stabilité
`
            },

            {
                nom: "Construction Bravo",
                contenu: `FICHE DE CONSTRUCTION

Construction Bravo

Matériel nécessaire :
- Exemple 1
- Exemple 2

Procédure :
1. Première étape
2. Deuxième étape
3. Vérification finale
`
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
- Exemple 1
- Exemple 2

Procédure :
1. Première étape
2. Deuxième étape
3. Troisième étape
`
            },

            {
                nom: "Construction Echo",
                contenu: `FICHE DE CONSTRUCTION

Construction Echo

Matériel nécessaire :
- Exemple 1
- Exemple 2

Procédure :
1. Première étape
2. Deuxième étape
3. Vérification finale
`
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


// ==========================================
// OUTIL
// ==========================================

function q(id) {
    return document.getElementById(id);
}


// ==========================================
// PAGE CONSTRUCTION
// ==========================================

function renderConstruction() {

    const select = q("constructionRegiment");
    const list = q("constructionList");

    if (!select || !list) {
        return;
    }

    const regiment = select.value;
    const data = REGIMENTS[regiment];

    list.innerHTML = "";

    if (!data) {
        return;
    }


    data.constructions.forEach((construction, index) => {

        const element = document.createElement("div");

        element.className = "item";


        const titre = document.createElement("strong");

        titre.textContent = `Construction ${index + 1}`;


        const nom = document.createElement("div");

        nom.textContent = construction.nom;

        nom.className = "muted";


        const bouton = document.createElement("button");

        bouton.type = "button";

        bouton.textContent = "⬇️ Télécharger";


        bouton.addEventListener("click", function () {

            downloadFile(
                construction.nom,
                construction.contenu
            );

        });


        element.appendChild(titre);

        element.appendChild(document.createElement("br"));

        element.appendChild(nom);

        element.appendChild(document.createElement("br"));

        element.appendChild(document.createElement("br"));

        element.appendChild(bouton);


        list.appendChild(element);

    });
}


// ==========================================
// TÉLÉCHARGEMENT
// ==========================================

function downloadFile(nom, contenu) {

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


// ==========================================
// PAGE NOTATION
// ==========================================

function renderNotation() {

    const select = q("notationRegiment");
    const list = q("notationList");

    if (!select || !list) {
        return;
    }

    const regiment = select.value;
    const data = REGIMENTS[regiment];

    list.innerHTML = "";

    if (!data) {
        return;
    }


    data.notation.forEach((critere, index) => {

        const element = document.createElement("div");

        element.className = "item";


        element.innerHTML = `
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


        list.appendChild(element);

    });


    calculateNotation();


    const inputs =
        list.querySelectorAll(".notation-input");


    inputs.forEach(input => {

        input.addEventListener(
            "input",
            calculateNotation
        );

    });
}


// ==========================================
// CALCUL NOTE
// ==========================================

function calculateNotation() {

    const select = q("notationRegiment");
    const list = q("notationList");
    const result = q("notationResult");

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

    let coefficients = 0;


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

        coefficients += critere.coefficient;

    });


    let score = 0;


    if (coefficients > 0) {
        score = total / coefficients;
    }


    result.textContent =
        "Note finale : " + score.toFixed(2) + " / 20";
}


// ==========================================
// INITIALISATION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // CONSTRUCTION

    const constructionSelect =
        q("constructionRegiment");


    if (constructionSelect) {

        constructionSelect.innerHTML = "";


        Object.keys(REGIMENTS).forEach(function (regiment) {

            const option =
                document.createElement("option");

            option.value = regiment;

            option.textContent = regiment;

            constructionSelect.appendChild(option);

        });


        constructionSelect.addEventListener(
            "change",
            renderConstruction
        );


        renderConstruction();

    }


    // NOTATION

    const notationSelect =
        q("notationRegiment");


    if (notationSelect) {

        notationSelect.innerHTML = "";


        Object.keys(REGIMENTS).forEach(function (regiment) {

            const option =
                document.createElement("option");

            option.value = regiment;

            option.textContent = regiment;

            notationSelect.appendChild(option);

        });


        notationSelect.addEventListener(
            "change",
            renderNotation
        );


        renderNotation();

    }

});
