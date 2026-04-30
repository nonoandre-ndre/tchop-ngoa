try {
      await addDoc(collection(db, "avis"), avisData);
      enregistrerSoumission(etablissementChoisi.id);
      envoiStatus.className = "envoi-status succes";
      envoiStatus.textContent = "Merci ! Votre avis a ete envoye avec succes.";
      setTimeout(function() {
        window.location.href = "merci.html";
      }, 1500);
    } catch (error) {
      console.error("Erreur Firebase:", error);
      envoiStatus.className = "envoi-status erreur";
      envoiStatus.textContent = "Une erreur est survenue. Veuillez reessayer.";
      btnEnvoyer.disabled = false;
      btnEnvoyer.innerHTML = "Envoyer mon avis";
    }
  


initEtoiles();
window.choisirType = choisirType;
window.allerStep = allerStep;