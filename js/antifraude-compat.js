// ===== ANTI-FRAUDE COMPAT - TCHOP-NGOA =====

var CAMPUS_UY1 = {
  lat: 3.8612,
  lng: 11.5167,
  rayon_metres: 800
};

function calculerDistance(lat1, lng1, lat2, lng2) {
  var R = 6371000;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLng = (lng2 - lng1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function verifierDoublon(etablissementId) {
  var cle = "tchop_avis_" + etablissementId;
  var dernierAvis = localStorage.getItem(cle);
  if (!dernierAvis) return { ok: true };

  var diff = Date.now() - parseInt(dernierAvis);
  var heuresRestantes = Math.ceil((86400000 - diff) / 3600000);

  if (diff < 86400000) {
    return {
      ok: false,
      message: "Vous avez deja evalue cet etablissement aujourd'hui. Revenez dans " + heuresRestantes + "h."
    };
  }
  return { ok: true };
}

function enregistrerSoumission(etablissementId) {
  localStorage.setItem("tchop_avis_" + etablissementId, Date.now().toString());
}

function genererFingerprint() {
  var data = [
    navigator.userAgent,
    navigator.language,
    screen.width + "x" + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    navigator.platform || ""
  ].join("|");

  var hash = 0;
  for (var i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function calculerScoreConfiance(donnees) {
  var score = 0;
  if (donnees.gps_ok) score += 25;
  if (donnees.matricule_valide) score += 20;
  if (donnees.temps_remplissage >= 60 && donnees.temps_remplissage <= 480) score += 15;
  var notes = donnees.notes || [];
  var uniquesNotes = [];
  notes.forEach(function(n) {
    if (uniquesNotes.indexOf(n) === -1) uniquesNotes.push(n);
  });
  if (uniquesNotes.length >= 3) score += 15;
  if (donnees.commentaire && donnees.commentaire.length >= 20) score += 10;
  if (donnees.fingerprint_ok) score += 10;
  var heure = new Date().getHours();
  if (heure >= 11 && heure <= 14) score += 5;
  return score;
}

function evaluerStatutAvis(score) {
  if (score >= 70) return "accepte";
  if (score >= 40) return "suspect";
  return "rejete";
}

function verifierAvantSoumission(etablissementId, callback) {
  var resultat = {
    ok: false,
    message: "",
    gps_ok: false,
    doublon_ok: false,
    fingerprint: genererFingerprint()
  };

  var doublon = verifierDoublon(etablissementId);
  if (!doublon.ok) {
    resultat.message = doublon.message;
    callback(resultat);
    return;
  }
  resultat.doublon_ok = true;

  // GPS en arriere-plan — ne bloque pas
  resultat.ok = true;
  resultat.gps_ok = false;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        var distance = calculerDistance(
          pos.coords.latitude, pos.coords.longitude,
          CAMPUS_UY1.lat, CAMPUS_UY1.lng
        );
        resultat.gps_ok = distance <= CAMPUS_UY1.rayon_metres;
        callback(resultat);
      },
      function() {
        callback(resultat);
      },
      { timeout: 5000 }
    );
  } else {
    callback(resultat);
  }
}