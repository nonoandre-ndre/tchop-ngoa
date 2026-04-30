// ===== SYSTÈME BILINGUE FR/EN - TCHOP-NGOA =====

const traductions = {
  fr: {
    hero_title: "Votre avis améliore<br>votre restaurant",
    hero_sub: "Notez la restauration de l'Université de Yaoundé 1",
    btn_donner_avis: "Donner mon avis",
    stat_avis: "Avis aujourd'hui",
    stat_note: "Note moyenne",
    stat_etablissements: "Établissements",
    menu_titre: "Menu du jour",
    classement_titre: "Classement du moment",
    voir_classement: "Voir le classement complet",
    footer_kiosque: "Enregistrer mon kiosque",
    chargement: "Chargement...",
    menu_ouvert: "Ouvert",
    menu_ferme: "Fermé",
    menu_bientot: "Bientôt ouvert",
    btn_evaluer: "Évaluer",
    menu_non_dispo: "Menu non encore disponible — revenez vers 09h00",
  },
  en: {
    hero_title: "Your feedback improves<br>your restaurant",
    hero_sub: "Rate the restaurants of the University of Yaoundé 1",
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
    menu_bientot: "Opening soon",
    btn_evaluer: "Review",
    menu_non_dispo: "Menu not yet available — check back around 9:00 AM",
  }
};

// Récupère la langue sauvegardée ou français par défaut
let langueActuelle = localStorage.getItem('tchop_langue') || 'fr';

// Applique la langue sur toute la page
function appliquerLangue(langue) {
  langueActuelle = langue;
  localStorage.setItem('tchop_langue', langue);

  // Traduit tous les éléments avec data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const cle = el.getAttribute('data-i18n');
    if (traductions[langue][cle]) {
      el.innerHTML = traductions[langue][cle];
    }
  });

  // Met à jour le bouton de langue
  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.textContent = langue === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR';
  }

  // Met à jour l'attribut lang de la page
  document.documentElement.lang = langue;
}

// Bouton de changement de langue
const langBtn = document.getElementById('langBtn');
if (langBtn) {
  langBtn.addEventListener('click', () => {
    const nouvelleLangue = langueActuelle === 'fr' ? 'en' : 'fr';
    appliquerLangue(nouvelleLangue);
  });
}

// Applique la langue au chargement
appliquerLangue(langueActuelle);

// Export pour utilisation dans d'autres fichiers
export { langueActuelle, traductions, appliquerLangue };