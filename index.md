<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Évaluation des régiments</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="container">
    <header class="hero">
      <p class="eyebrow">SYSTÈME D'ÉVALUATION</p>
      <h1>Notation des régiments</h1>
      <p class="subtitle">Sélectionne un régiment pour charger automatiquement ses critères et coefficients.</p>
    </header>

    <section class="card">
      <label for="regiment">Régiment</label>
      <select id="regiment">
        <option value="">— Sélectionner un régiment —</option>
      </select>
    </section>

    <section id="evaluation" class="card hidden">
      <div class="section-heading">
        <div>
          <p class="eyebrow">ÉVALUATION</p>
          <h2 id="regimentTitle">Régiment</h2>
        </div>
        <div class="score-badge">
          <span>Note finale</span>
          <strong id="finalScore">—</strong>
        </div>
      </div>

      <div id="criteriaList" class="criteria-list"></div>

      <div class="actions">
        <button id="resetBtn" class="secondary">Réinitialiser les notes</button>
      </div>
    </section>

    <section id="emptyState" class="empty card">
      <div class="empty-icon">◎</div>
      <h2>Aucun régiment sélectionné</h2>
      <p>Choisis un régiment ci-dessus pour commencer une évaluation.</p>
    </section>
  </main>

  <footer>
    <span>Évaluation des régiments</span>
    <span>•</span>
    <span>GitHub Pages compatible</span>
  </footer>

  <script src="script.js"></script>
</body>
</html>
