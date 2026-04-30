// ===== VALIDATION MATRICULE UY1 - TCHOP-NGOA =====

// Format matricule UY1 : XX + [A-Z] + XXXX
// Exemple : 24F2067, 21G2034, 19A0012

// Plage d'années valides (controlée par le Super Admin)
// Ces valeurs seront chargées depuis Firebase en production
const CONFIG_MATRICULE = {
  annee_min: 18,      // Entrée en 2018 minimum
  annee_max: 25,      // Entrée en 2025 maximum (avril 2026)
  autoriser_26: false // Matricules 2026 pas encore disponibles
};

// Expression régulière du format matricule UY1
const REGEX_MATRICULE = /^([0-9]{2})([A-Z])([0-9]{4})$/;

// Valide un matricule UY1
function validerMatricule(matricule) {
  const resultat = {
    valide: false,
    message: '',
    annee: null,
    lettre: null,
    serie: null
  };

  // Vérification longueur
  if (!matricule || matricule.length !== 7) {
    resultat.message = 'Le matricule doit contenir exactement 7 caractères.';
    return resultat;
  }

  // Mise en majuscules automatique
  matricule = matricule.toUpperCase();

  // Vérification format
  const match = matricule.match(REGEX_MATRICULE);
  if (!match) {
    resultat.message = 'Format invalide. Exemple correct : 24F2067';
    return resultat;
  }

  const annee = parseInt(match[1]);
  const lettre = match[2];
  const serie = match[3];

  // Vérification année minimum
  if (annee < CONFIG_MATRICULE.annee_min) {
    resultat.message = Les matricules avant 20${CONFIG_MATRICULE.annee_min} ne sont pas acceptés.;
    return resultat;
  }

  // Vérification année maximum
  if (annee === 26 && !CONFIG_MATRICULE.autoriser_26) {
    resultat.message = "Les matricules 2026 ne sont pas encore activés. Référez-vous à l'administration.";
    return resultat;
  }

  if (annee > 26) {
    resultat.message = 'Année de matricule invalide.';
    return resultat;
  }

  if (annee > CONFIG_MATRICULE.annee_max && annee !== 26) {
    resultat.message = Les matricules 20${annee} ne sont pas encore acceptés.;
    return resultat;
  }

  // Matricule valide
  resultat.valide = true;
  resultat.annee = annee;
  resultat.lettre = lettre;
  resultat.serie = serie;
  resultat.message = '✓ Matricule valide';
  return resultat;
}

// Affiche le résultat de validation en temps réel
function validerMatriculeTempsReel(inputElement, feedbackElement) {
  const matricule = inputElement.value.toUpperCase();
  inputElement.value = matricule;

  if (matricule.length === 0) {
    feedbackElement.textContent = '';
    feedbackElement.className = 'matricule-feedback';
    return;
  }

  const resultat = validerMatricule(matricule);

  feedbackElement.textContent = resultat.message;
  feedbackElement.className = resultat.valide
    ? 'matricule-feedback valide'
    : 'matricule-feedback invalide';
}

export { validerMatricule, validerMatriculeTempsReel, CONFIG_MATRICULE };