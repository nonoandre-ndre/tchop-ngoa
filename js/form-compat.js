// ===== LOGIQUE FORMULAIRE COMPAT - TCHOP-NGOA =====

var etablissementChoisi = null;
var typeChoisi = null;
var tempsDebut = Date.now();
var notesChoisies = {};

var ETABLISSEMENTS = [
  { id: "RU-01", nom: "Restaurant Universitaire N1", localisation: "Derriere l'Amphi 700", type: "restaurant", note: 0 },
  { id: "RU-02", nom: "Restaurant Universitaire N2", localisation: "Pres de la Faculte des Sciences", type: "restaurant", note: 0 }
];

var TEXTES = {
  fr: {
    repas_alert: "Veuillez choisir le repas evalue.",
    criteres_alert: "Veuillez noter tous les criteres obligatoires (*).",
    choisir_etab_alert: "Veuillez selectionner un etablissement.",
    confirmation_alert: "Veuillez cocher la case de confirmation.",
    envoi_cours: "Envoi en cours...",
    merci: "Merci ! Votre avis a ete envoye avec succes.",
    erreur: "Une erreur est survenue. Veuillez reessayer.",
    envoyer: "Envoyer mon avis",
    nouveau: "Nouveau"
  },
  en: {
    repas_alert: "Please choose the meal you are reviewing.",
    criteres_alert: "Please rate all required criteria (*).",
    choisir_etab_alert: "Please select an establishment.",
    confirmation_alert: "Please check the confirmation box.",
    envoi_cours: "Sending...",
    merci: "Thank you! Your review has been sent successfully.",
    erreur: "An error occurred. Please try again.",
    envoyer: "Send my review",
    nouveau: "New"
  }
};

function getLang() {
  return localStorage.getItem("tchop_langue") || "fr";
}

function t(cle) {
  var lang = getLang();
  return (TEXTES[lang] && TEXTES[lang][cle]) ? TEXTES[lang][cle] : TEXTES["fr"][cle];
}

function choisirType(type) {
  typeChoisi = type;

  document.getElementById("btnRestaurant").className = "type-btn" + (type === "restaurant" ? " selected" : "");
  document.getElementById("btnKiosque").className = "type-btn" + (type === "kiosque" ? " selected" : "");

  var liste = document.getElementById("listeEtablissements");
  var grid = document.getElementById("etablissementsGrid");

  liste.classList.remove("hidden");
  grid.innerHTML = "";

  var filtres = ETABLISSEMENTS.filter(function(e) { return e.type === type; });

  if (filtres.length === 0) {
    grid.innerHTML = "<p style='color:#616161;font-size:14px;'>Aucun etablissement disponible.</p>";
    return;
  }

  filtres.forEach(function(etab) {
    var card = document.createElement("div");
    card.className = "etab-card";
    card.innerHTML =
      "<div>" +
        "<div class='etab-nom'>" + etab.nom + "</div>" +
        "<div class='etab-loc'>" + etab.localisation + "</div>" +
      "</div>" +
      "<div class='etab-note'>" + (etab.note > 0 ? etab.note.toFixed(1) + " etoile" : t("nouveau")) + "</div>";

    card.onclick = function() {
      var cards = document.querySelectorAll(".etab-card");
      cards.forEach(function(c) { c.classList.remove("selected"); });
      card.classList.add("selected");
      etablissementChoisi = etab;
      setTimeout(function() { allerStep(2); }, 400);
    };
    grid.appendChild(card);
  });
}

function allerStep(num) {
  if (num === 3) {
    var repas = document.querySelector("input[name='repas']:checked");
    if (!repas) {
      alert(t("repas_alert"));
      return;
    }
  }

  if (num === 4) {
    var criteresObligatoires = [
      "qualite_gustative", "quantite", "rapport_qualite_prix",
      "proprete_salle", "proprete_infra", "rapidite_service",
      "amabilite_personnel", "couverts"
    ];
    var manquants = criteresObligatoires.filter(function(c) { return !notesChoisies[c]; });
    if (manquants.length > 0) {
      alert(t("criteres_alert"));
      return;
    }
  }

  var steps = document.querySelectorAll(".form-step");
  steps.forEach(function(s) { s.classList.remove("active"); });
  document.getElementById("step" + num).classList.add("active");
  window.scrollTo(0, 0);
}

function initEtoiles() {
  var groupes = document.querySelectorAll(".etoiles");
  groupes.forEach(function(groupe) {
    var critere = groupe.getAttribute("data-critere");
    var etoiles = groupe.querySelectorAll(".etoile");etoiles.forEach(function(etoile, index) {
      etoile.onclick = function() {
        var valeur = index + 1;
        notesChoisies[critere] = valeur;
        etoiles.forEach(function(e, i) {
          e.style.color = i < valeur ? "#F57F17" : "#E0E0E0";
        });
      };

      etoile.onmouseover = function() {
        etoiles.forEach(function(e, i) {
          e.style.color = i <= index ? "#F57F17" : "#E0E0E0";
        });
      };

      etoile.onmouseout = function() {
        var noteActuelle = notesChoisies[critere] || 0;
        etoiles.forEach(function(e, i) {
          e.style.color = i < noteActuelle ? "#F57F17" : "#E0E0E0";
        });
      };
    });
  });
}

var commentaireEl = document.getElementById("commentaire");
if (commentaireEl) {
  commentaireEl.oninput = function() {
    document.getElementById("charCount").textContent = commentaireEl.value.length;
  };
}

var matriculeInput = document.getElementById("matricule");
var matriculeFeedback = document.getElementById("matriculeFeedback");
if (matriculeInput) {
  matriculeInput.oninput = function() {
    validerMatriculeTempsReel(matriculeInput, matriculeFeedback);
  };
}

var form = document.getElementById("formAvis");
if (form) {
  form.onsubmit = function(e) {
    e.preventDefault();

    if (!etablissementChoisi) {
      alert(t("choisir_etab_alert"));
      return;
    }

    var confirmation = document.getElementById("confirmation");
    if (!confirmation.checked) {
      alert(t("confirmation_alert"));
      return;
    }

    var btnEnvoyer = document.getElementById("btnEnvoyer");
    var envoiStatus = document.getElementById("envoiStatus");
    btnEnvoyer.disabled = true;
    btnEnvoyer.textContent = t("envoi_cours");

    verifierAvantSoumission(etablissementChoisi.id, function(antifraude) {
      var fruits = [];
      document.querySelectorAll("input[name='fruits']:checked").forEach(function(f) {
        fruits.push(f.value);
      });

      var matriculeVal = document.getElementById("matricule").value;
      var matriculeResult = validerMatricule(matriculeVal);
      var tempsRemplissage = Math.floor((Date.now() - tempsDebut) / 1000);
      var fingerprint = genererFingerprint();

      var notesArray = [];
      Object.keys(notesChoisies).forEach(function(k) { notesArray.push(notesChoisies[k]); });

      var score = calculerScoreConfiance({
        gps_ok: antifraude.gps_ok,
        matricule_valide: matriculeResult.valide,
        temps_remplissage: tempsRemplissage,
        notes: notesArray,
        commentaire: document.getElementById("commentaire").value,
        fingerprint_ok: true
      });

      var statut = evaluerStatutAvis(score);

      var notesObligatoires = [
        notesChoisies.qualite_gustative, notesChoisies.quantite,
        notesChoisies.rapport_qualite_prix, notesChoisies.proprete_salle,
        notesChoisies.proprete_infra, notesChoisies.rapidite_service,
        notesChoisies.amabilite_personnel, notesChoisies.couverts
      ].filter(Boolean);

      var noteGlobale = notesObligatoires.reduce(function(a, b) { return a + b; }, 0) / notesObligatoires.length;

      var repasEl = document.querySelector("input[name='repas']:checked");
      var niveauEl = document.querySelector("input[name='niveau']:checked");
      var prixEl = document.querySelector("input[name='prix']:checked");

      var avisData = {
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        langue: getLang(),
        etablissement_id: etablissementChoisi.id,
        etablissement_nom: etablissementChoisi.nom,
        etablissement_type: typeChoisi,
        repas: repasEl ? repasEl.value : "",
        filiere: document.getElementById("filiere").value,
        niveau: niveauEl ? niveauEl.value : "",
        plats: document.getElementById("plats").value,fruits: fruits,
        prix_paye: prixEl ? prixEl.value : "",
        notes: notesChoisies,
        note_globale: parseFloat(noteGlobale.toFixed(2)),
        signalement: document.getElementById("signalement").value,
        commentaire: document.getElementById("commentaire").value,
        matricule_valide: matriculeResult.valide,
        score_confiance: score,
        statut: statut,
        device_fingerprint: fingerprint,
        temps_remplissage: tempsRemplissage
      };

      db.collection("avis").add(avisData)
        .then(function() {
          enregistrerSoumission(etablissementChoisi.id);
          envoiStatus.className = "envoi-status succes";
          envoiStatus.textContent = t("merci");
          setTimeout(function() {
            window.location.href = "merci.html";
          }, 1500);
        })
        .catch(function(error) {
          console.error("Erreur Firebase:", error);
          envoiStatus.className = "envoi-status erreur";
          envoiStatus.textContent = t("erreur");
          btnEnvoyer.disabled = false;
          btnEnvoyer.textContent = t("envoyer");
        });
    });
  };
}

initEtoiles();