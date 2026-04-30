const notesObligatoires = [
      notesChoisies.qualite_gustative, notesChoisies.quantite,
      notesChoisies.rapport_qualite_prix, notesChoisies.proprete_salle,
      notesChoisies.proprete_infra, notesChoisies.rapidite_service,
      notesChoisies.amabilite_personnel, notesChoisies.couverts
    ].filter(Boolean);

    const noteGlobale = notesObligatoires.reduce(function(a, b) { return a + b; }, 0) / notesObligatoires.length;

    const avisData = {
      timestamp: serverTimestamp(),
      langue: getLang(),
      etablissement_id: etablissementChoisi.id,
      etablissement_nom: etablissementChoisi.nom,
      etablissement_type: typeChoisi,
      repas: document.querySelector("input[name='repas']:checked") ? document.querySelector("input[name='repas']:checked").value : "",
      filiere: document.getElementById("filiere").value,
      niveau: document.querySelector("input[name='niveau']:checked") ? document.querySelector("input[name='niveau']:checked").value : "",
      plats: document.getElementById("plats").value,
      fruits: fruits,
      prix_paye: document.querySelector("input[name='prix']:checked") ? document.querySelector("input[name='prix']:checked").value : "",
      notes: notesChoisies,
      note_globale: parseFloat(noteGlobale.toFixed(2)),
      signalement: document.getElementById("signalement").value,
      commentaire: document.getElementById("commentaire").value,
      matricule_valide: matriculeResult.valide,
      score_confiance: score,
      statut: statut,
      device_fingerprint: fingerprint,
      temps_remplissage: tempsRemplissage,
    };

    try {
      await addDoc(collection(db, "avis"), avisData);
      enregistrerSoumission(etablissementChoisi.id);
      envoiStatus.className = "envoi-status succes";
      envoiStatus.textContent = t("merci");
      setTimeout(function() {
        window.location.href = "merci.html";
      }, 1500);
    } catch (error) {
      console.error("Erreur Firebase:", error);
      envoiStatus.className = "envoi-status erreur";
      envoiStatus.textContent = t("erreur");
      btnEnvoyer.disabled = false;
      btnEnvoyer.innerHTML = t("envoyer");
    }
  
initEtoiles();
window.choisirType = choisirType;
window.allerStep = allerStep;