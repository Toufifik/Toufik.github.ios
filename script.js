// AJOUTE/MODIFIE TES REGIMENTS ICI
const REGIMENTS={
  "41st":{
    constructions:["Construction Alpha","Construction Bravo"],
    notation:[{nom:"Traque",coefficient:2,max:20},{nom:"Reconnaissance",coefficient:3,max:20}]
  },
  "65st":{
    constructions:["Construction Delta","Construction Echo"],
    notation:[{nom:"Extraction VIP",coefficient:3,max:20},{nom:"CQB",coefficient:4,max:20}]
  }
};

const THEORIE=[
  {titre:"Introduction",texte:"Ajoute ici ton document théorique et les notions à connaître."},
  {titre:"Procédures",texte:"Ajoute ici les procédures générales et consignes."},
  {titre:"Préparation",texte:"Ajoute ici les éléments à vérifier avant une évaluation."}
];

function q(id){return document.getElementById(id)}
function fillSelect(s){if(!s)return;Object.keys(REGIMENTS).forEach(n=>{let o=document.createElement("option");o.value=n;o.textContent=n;s.appendChild(o)})}
function renderConstruction(){
 const s=q("regimentSelect"),l=q("constructionList"),t=q("selectedRegiment");if(!s||!l)return;
e.innerHTML = `
    <strong>Construction ${i+1}</strong>
    <br>
    <span class="muted">${esc(c)}</span>
    <br><br>
    <button onclick="downloadFile('${esc(c)}')">
        ⬇️ Télécharger
    </button>
`;
}
function renderNotation(){
 const s=q("regimentSelect"),l=q("criteriaList"),t=q("selectedRegiment"),f=q("finalScore");if(!s||!l)return;
 l.innerHTML="";let n=s.value;if(!n){t.textContent="Aucun régiment sélectionné";f.textContent="—";return}t.textContent=n;
 REGIMENTS[n].notation.forEach((c,i)=>{let e=document.createElement("div");e.className="row";e.innerHTML="<div><strong>"+esc(c.nom)+"</strong><div class='muted'>Maximum : "+c.max+"/20</div></div><div class='coeff'>Coef. ×"+c.coefficient+"</div><input class='score' type='number' min='0' max='"+c.max+"' step='0.5' data-index='"+i+"' placeholder='0'>";l.appendChild(e)});
 l.querySelectorAll("input").forEach(x=>x.addEventListener("input",calc));calc()
}
function calc(){
 let s=q("regimentSelect"),f=q("finalScore");if(!s||!f||!REGIMENTS[s.value])return;
 let cs=REGIMENTS[s.value].notation,ins=document.querySelectorAll("#criteriaList input"),total=0,coefs=0;
 cs.forEach((c,i)=>{let n=Math.max(0,Math.min(Number(ins[i]?.value)||0,c.max));total+=(n/c.max*20)*c.coefficient;coefs+=c.coefficient});
 f.textContent=(coefs?total/coefs:0).toFixed(2)+"/20"
}
function renderTheory(){let t=q("theoryList");if(!t)return;THEORIE.forEach(x=>{let e=document.createElement("article");e.className="item";e.innerHTML="<h3>"+esc(x.titre)+"</h3><p>"+esc(x.texte)+"</p>";t.appendChild(e)})}
function esc(v){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
document.addEventListener("DOMContentLoaded",()=>{let s=q("regimentSelect");fillSelect(s);if(s)s.addEventListener("change",()=>{if(q("constructionList"))renderConstruction();if(q("criteriaList"))renderNotation()});if(q("constructionList"))renderConstruction();if(q("criteriaList"))renderNotation();renderTheory()});

function downloadFile(text) {
    const contenu = text;

    const blob = new Blob(
        [contenu],
        { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);

    const lien = document.createElement("a");
    lien.href = url;
    lien.download = "construction.txt";

    document.body.appendChild(lien);
    lien.click();
    lien.remove();

    URL.revokeObjectURL(url);
}
