// ===== SYSTÈME BILINGUE FR/EN COMPAT - TCHOP-NGOA =====

var traductions = {
  fr: {
    hero_title: "Votre avis ameliore votre restaurant",
    hero_sub: "Notez la restauration de l'Universite de Yaounde 1",
    btn_donner_avis: "Donner mon avis",
    stat_avis: "Avis aujourd'hui",
    stat_note: "Note moyenne",
    stat_etablissements: "Etablissements",
    menu_titre: "Menu du jour",
    classement_titre: "Classement du moment",
    voir_classement: "Voir le classement complet",
    footer_kiosque: "Enregistrer mon kiosque",
    chargement: "Chargement...",
    menu_ouvert: "Ouvert",
    menu_ferme: "Ferme",
    menu_non_dispo: "Menu non encore disponible"
  },
  en: {
    hero_title: "Your feedback improves your restaurant",
    hero_sub: "Rate the restaurants of the University of Yaounde 1",
    btn_donner_avis: "Give my review",
    stat_avis: "Reviews today",
    stat_note: "Average rating",
    stat_etablissements: "Establishments",
    menu_titre: "Today's menu",
    classement_titre: "Current ranking",
    voir_classement: "See full ranking",
    footer_kiosque: "Register my kiosk",
    chargement: "Loading...",
    menu_ouvert: "Open",
    menu_ferme: "Closed",
    menu_non_dispo: "Menu not yet available"
  }
};

var langueActuelle = localStorage.getItem("tchop_langue") || "fr";

function appliquerLangue(langue) {
  langueActuelle = langue;
  localStorage.setItem("tchop_langue", langue);

  document.querySelectorAll("[data-i18n]").forEach(function(el) {
    var cle = el.getAttribute("data-i18n");
    if (traductions[langue] && traductions[langue][cle]) {
      el.innerHTML = traductions[langue][cle];
    }
  });

  var langBtn = document.getElementById("langBtn");
  if (langBtn) {
    langBtn.textContent = langue === "fr" ? "EN" : "FR";
  }

  document.documentElement.lang = langue;
}

var langBtn = document.getElementById("langBtn");
if (langBtn) {
  langBtn.addEventListener("click", function() {
    var nouvelleLangue = langueActuelle === "fr" ? "en" : "fr";
    appliquerLangue(nouvelleLangue);
  });
}

appliquerLangue(langueActuelle);