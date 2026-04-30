// ===== SYSTÈME ANTI-FRAUDE - TCHOP-NGOA =====

// ── Couche 1 : Périmètre GPS Campus UY1 ──
const CAMPUS_UY1 = {
  lat: 3.8612,
  lng: 11.5167,
  rayon_metres: 800
};

function calculerDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

async function verifierGPS() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ ok: false, message: 'GPS non disponible sur cet appareil.' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const distance = calculerDistance(
          pos.coords.latitude,
          pos.coords.longitude,
          CAMPUS_UY1.lat,
          CAMPUS_UY1.lng
        );
        if (distance <= CAMPUS_UY1.rayon_metres) {
          resolve({ ok: true, distance, coords: pos.coords });
        } else {
          resolve({
            ok: false,
            message: 'Vous devez être sur le campus UY1 pour soumettre un avis.',
            distance
          });
        }
      },
      () => resolve({ ok: false, message: 'Impossible de vérifier votre position GPS.' })
    );
  });
}

// ── Couche 2 : Anti-doublon localStorage ──
function verifierDoublon(etablissementId) {
  const cle = tchop_avis_${etablissementId};
  const dernierAvis = localStorage.getItem(cle);
  if (!dernierAvis) return { ok: true };

  const diff = Date.now() - parseInt(dernierAvis);
  const heuresRestantes = Math.ceil((86400000 - diff) / 3600000);

  if (diff < 86400000) {
    return {
      ok: false,
      message: Vous avez déjà évalué cet établissement aujourd'hui. Revenez dans ${heuresRestantes}h.
    };
  }
  return { ok: true };
}

function enregistrerSoumission(etablissementId) {
  localStorage.setItem(tchop_avis_${etablissementId}, Date.now().toString());
}

// ── Couche 3 : Empreinte navigateur ──
function genererFingerprint() {
  const data = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    navigator.platform || ''
  ].join('|');

  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

// ── Couche 4 : Score de confiance ──
function calculerScoreConfiance(donnees) {
  let score = 0;

  if (donnees.gps_ok) score += 25;
  if (donnees.matricule_valide) score += 20;
  if (donnees.temps_remplissage >= 60 && donnees.temps_remplissage <= 480) score += 15;

  // Notes variées
  const notes = donnees.notes || [];
  const uniquesNotes = new Set(notes);
  if (uniquesNotes.size >= 3) score += 15;

  if (donnees.commentaire && donnees.commentaire.length >= 20) score += 10;
  if (donnees.fingerprint_ok) score += 10;

  // Bonus heure d'ouverture
  const heure = new Date().getHours();
  if (heure >= 11 && heure <= 14) score += 5;

  return score;
}

function evaluerStatutAvis(score) {
  if (score >= 70) return 'accepte';
  if (score >= 40) return 'suspect';
  return 'rejete';
}

// ── Vérification complète avant soumission ──
async function verifierAvantSoumission(etablissementId) {
  const resultat = {
    ok: false,
    message: '',
    gps_ok: false,
    doublon_ok: false,
    fingerprint: genererFingerprint()
  };

  // Vérif doublon
  const doublon = verifierDoublon(etablissementId);
  if (!doublon.ok) {
    resultat.message = doublon.message;
    return resultat;
  }
  resultat.doublon_ok = true;

  // Vérif GPS
  const gps = await verifierGPS();
  resultat.gps_ok = gps.ok;
  if (!gps.ok) {
    resultat.message = gps.message;
    return resultat;
  }

  resultat.ok = true;
  resultat.coords = gps.coords;
  return resultat;
}export {
  verifierAvantSoumission,
  calculerScoreConfiance,
  evaluerStatutAvis,
  enregistrerSoumission,
  genererFingerprint
};