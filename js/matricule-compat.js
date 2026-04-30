// ===== VALIDATION MATRICULE UY1 - COMPAT =====

var CONFIG_MATRICULE = {
  annee_min: 18,
  annee_max: 25,
  autoriser_26: false
};

var REGEX_MATRICULE = /^([0-9]{2})([A-Z])([0-9]{4})$/;

function validerMatricule(matricule) {
  var resultat = {
    valide: false,
    message: "",
    annee: null,
    lettre: null,
    serie: null
  };

  if (!matricule || matricule.length !== 7) {
    resultat.message = "Le matricule doit contenir exactement 7 caracteres.";
    return resultat;
  }

  matricule = matricule.toUpperCase();

  var match = matricule.match(REGEX_MATRICULE);
  if (!match) {
    resultat.message = "Format invalide. Exemple correct : 24F2067";
    return resultat;
  }

  var annee = parseInt(match[1]);
  var lettre = match[2];
  var serie = match[3];

  if (annee < CONFIG_MATRICULE.annee_min) {
    resultat.message = "Les matricules avant 20" + CONFIG_MATRICULE.annee_min + " ne sont pas acceptes.";
    return resultat;
  }

  if (annee === 26 && !CONFIG_MATRICULE.autoriser_26) {
    resultat.message = "Les matricules 2026 ne sont pas encore actives.";
    return resultat;
  }

  if (annee > CONFIG_MATRICULE.annee_max && annee !== 26) {
    resultat.message = "Les matricules 20" + annee + " ne sont pas encore acceptes.";
    return resultat;
  }

  resultat.valide = true;
  resultat.annee = annee;
  resultat.lettre = lettre;
  resultat.serie = serie;
  resultat.message = "Matricule valide";
  return resultat;
}

function validerMatriculeTempsReel(inputElement, feedbackElement) {
  var matricule = inputElement.value.toUpperCase();
  inputElement.value = matricule;

  if (matricule.length === 0) {
    feedbackElement.textContent = "";
    feedbackElement.className = "matricule-feedback";
    return;
  }

  var resultat = validerMatricule(matricule);
  feedbackElement.textContent = resultat.message;
  feedbackElement.className = resultat.valide
    ? "matricule-feedback valide"
    : "matricule-feedback invalide";
}