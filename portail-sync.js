/* CAN LAB <-> portail SkillBeam Laboratoire : sauvegarde automatique des reponses sur le compte de l'eleve (decision D39).
   - Eleve connecte au portail (https://lab.innov365.fr) : chaque saisie est envoyee (regroupee toutes les ~0,8 s) et
     restauree sur n'importe quel appareil.
   - Non connecte : rien n'est envoye ; les reponses restent seulement dans ce navigateur (comportement d'origine).
   - Jamais envoyes : les champs nom, prenom et formation (identite deja connue du portail).
   Maintenu par Claude (portail #33). Aucune dependance, aucune donnee vers un autre site. */
(() => {
  const API = 'https://lab.innov365.fr/api/reponses';
  const LOGIN = 'https://lab.innov365.fr/?role=eleve';
  const page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html?$/, '') || 'index';
  const ACT = 'canlab/' + page.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
  const EXCLUS = new Set(['nom', 'prenom', 'formation']);
  const HEADERS = { 'X-SkillBeam-Lab': '1' };
  const champs = () => [...document.querySelectorAll('[data-answer][id], textarea[id], select[id], input[id]')]
    .filter(e => !EXCLUS.has(e.id) && /^[A-Za-z0-9][A-Za-z0-9._:-]{0,63}$/.test(e.id) &&
      (e.tagName !== 'INPUT' || ['range', 'text', 'number', ''].includes((e.getAttribute('type') || '').toLowerCase())));
  const valeur = e => String(e.value ?? '').slice(0, 4000);

  const badge = document.createElement('div');
  badge.id = 'portail-sync'; badge.setAttribute('role', 'status');
  Object.assign(badge.style, { position: 'fixed', left: '12px', bottom: '12px', zIndex: 2147483000, maxWidth: 'min(360px, calc(100vw - 24px))',
    font: '12px/1.4 system-ui, sans-serif', background: '#25221e', color: '#f7f3e9', padding: '8px 11px', borderLeft: '4px solid #f6ad42',
    boxShadow: '0 2px 8px rgba(0,0,0,.25)' });
  const dire = (html, ok) => { badge.innerHTML = html; badge.style.borderLeftColor = ok ? '#42734a' : '#f6ad42'; if (!badge.isConnected) document.body.append(badge); };

  let connecte = false, prenom = '', restauration = false, attente = {}, minuterie = null, echecs = 0;
  const heure = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  async function envoyer(keepalive = false) {
    clearTimeout(minuterie); minuterie = null;
    const lot = attente; attente = {};
    if (!connecte || !Object.keys(lot).length) return;
    try {
      const r = await fetch(API, { method: 'POST', credentials: 'include', keepalive, headers: { ...HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ activite: ACT, reponses: lot }) });
      if (r.status === 401) { connecte = false; attente = { ...lot, ...attente }; return hors_ligne('Session terminée'); }
      if (!r.ok) throw new Error(r.status);
      echecs = 0; dire(`✓ Réponses enregistrées sur ton compte${prenom ? ' (' + prenom + ')' : ''} · ${heure()}`, true);
    } catch (e) {
      attente = { ...lot, ...attente }; echecs += 1;
      dire('Enregistrement en attente (réseau) : nouvel essai automatique…', false);
      minuterie = setTimeout(envoyer, Math.min(30000, 2000 * echecs));
    }
  }
  function planifier(e) {
    if (restauration || !connecte) return;
    const c = e.target; if (!c || !c.id || !champs().includes(c)) return;
    attente[c.id] = valeur(c);
    clearTimeout(minuterie); minuterie = setTimeout(envoyer, 800);
  }
  function hors_ligne(raison) {
    dire(`${raison ? raison + ' · ' : ''}Non connecté au portail : réponses gardées sur cet appareil seulement. <a href="${LOGIN}" style="color:#f6ad42">Se connecter</a> pour les enregistrer sur ton compte.`, false);
  }

  document.addEventListener('input', planifier, true);
  document.addEventListener('change', planifier, true);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') envoyer(true); });

  fetch(API + '?activite=' + encodeURIComponent(ACT), { credentials: 'include', headers: HEADERS })
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(d => {
      connecte = true; prenom = d.prenom || '';
      const serveur = d.reponses || {}, local = {};
      restauration = true;
      for (const c of champs()) {
        const s = serveur[c.id], v = valeur(c), vierge = v === '' || v === String(c.defaultValue ?? '');
        if (s !== undefined && s !== v && vierge) { c.value = s; c.dispatchEvent(new Event('input', { bubbles: true })); c.dispatchEvent(new Event('change', { bubbles: true })); }
        else if (!vierge && s !== v) local[c.id] = v;   // travail fait hors connexion : envoye au compte
      }
      restauration = false;
      const n = Object.keys(serveur).length;
      dire(`✓ Connecté${prenom ? ' : ' + prenom : ''} · tes réponses sont enregistrées automatiquement sur ton compte${n ? ' (' + n + ' restaurée' + (n > 1 ? 's' : '') + ')' : ''}.`, true);
      if (Object.keys(local).length) { attente = local; envoyer(); }
    })
    .catch(() => hors_ligne(''));
})();
