/* V28 prototype isolé : aucune IA, aucune requête réseau. */
(() => {
'use strict';
const $=id=>document.getElementById(id);
const el=(tag,txt,cls)=>{const e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;if(cls)e.className=cls;return e};
const btn=(txt,fn)=>{const b=el('button',txt);b.type='button';b.addEventListener('click',fn);return b};
const key='canlab-v28-prototype-bilan-1';
let state={};try{state=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{}
function persist(){try{localStorage.setItem(key,JSON.stringify(state));return true}catch{return false}}
const size=$('v28-size'),spaced=$('v28-spaced');
size.addEventListener('input',()=>{document.documentElement.style.setProperty('--v28-font',size.value+'px');$('v28-size-out').textContent=size.value+' px'});
spaced.addEventListener('change',()=>document.body.classList.toggle('v28-spaced',spaced.checked));
const bank={
c01:{title:'Acquérir une information',core:[
['a','Un distributeur de savon automatique détecte une main. Décris la grandeur physique à observer, le rôle du capteur et le signal délivré.'],
['b','Un microphone fournit une tension variable. Explique comment cette tension peut représenter le son.'],
['c','Une alarme reçoit seulement un état ouvert ou fermé. Explique ce que ce signal permet de connaître et ce qu’il ne permet pas de mesurer.']],
reinforce:['r','Un thermomètre affiche 28 °C. Distingue la grandeur mesurée, le capteur, le signal électrique et l’information affichée.'],
transfer:['t','Compare les chaînes d’acquisition d’une montre de sport et d’un détecteur de fumée. Justifie une différence.'],
extra:['e','Propose une manière de vérifier expérimentalement si la tension d’un capteur suit la grandeur mesurée.']},
c02:{title:'Observer et mesurer',graph:{x:'Temps (s)',y:'Température (°C)',xs:[0,10,20,30,40,50,60],ys:[50,48,42,36,31,28,26],lo:20,hi:60},core:[
['a','Sur la courbe simulée, place deux curseurs aux instants 10 s et 40 s. Relève les températures et décris l’évolution.','graph'],
['b','Comment distinguer une valeur maximale d’une variation de grandeur ? Justifie avec les axes de la courbe.','graph'],
['c','Explique pourquoi une tension de parole irrégulière ne permet pas toujours de définir une période.']],
reinforce:['r','Relève deux valeurs distinctes de température sur la courbe et explique ce que représentent leurs coordonnées.','graph'],
transfer:['t','La diminution de température est-elle régulière sur toute la durée ? Compare deux intervalles de même durée et justifie.','graph'],
extra:['e','Explique comment choisir les graduations pour améliorer la précision d’une lecture graphique.']},
c03:{title:'Caractériser un capteur',graph:{x:'Pression (bar)',y:'Tension (V)',xs:[0,1,2,3,4,5,6,7,8],ys:[1,1.5,2,2.5,3,3.5,4,4.5,5],lo:0,hi:6},core:[
['a','À partir de la caractéristique simulée, relève deux points et détermine la sensibilité du capteur. Écris ta relation et tes unités.','graph'],
['b','Détermine la pression correspondant à une tension de 4 V. Justifie ton calcul avec la tension à l’origine.','math'],
['c','Explique pourquoi deux capteurs de sensibilités différentes ne produisent pas la même variation de tension pour une même variation de pression.']],
reinforce:['r','Sur la courbe, relève la tension à pression nulle. Écris la relation entre tension et pression et explique son terme constant.','graph'],
transfer:['t','Une erreur de tension de 0,10 V est commise avec ce capteur. Détermine l’erreur de pression correspondante, puis explique le rôle de la sensibilité.','math'],
extra:['e','Propose un protocole pour vérifier que la caractéristique est linéaire et précise comment exploiter tes mesures.']},
c04:{title:'Caractériser les signaux logiques',graph:{x:'Temps (ms)',y:'Tension (V)',xs:[0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8],ys:[3.3,3.3,3.3,0,0,0,0,0,3.3,3.3,3.3,0,0,0,0,0,3.3],lo:0,hi:4,step:true},core:[
['a','Sur le signal PWM simulé, relève deux fronts montants successifs et calcule la fréquence en hertz.','graph'],
['b','Détermine la durée haute et le rapport cyclique en pourcentage. Justifie avec une relation.','graph'],
['c','Explique ce que modifierait un doublement de la durée haute sans changement de période ni des niveaux.']],
reinforce:['r','Explique la différence entre période et durée haute, puis indique la conversion nécessaire pour calculer la fréquence en hertz.','math'],
transfer:['t','Un tachymètre produit quatre impulsions par tour et une impulsion toutes les 10 ms. Calcule la vitesse en tr/min et explique ta démarche.','math'],
extra:['e','Pour le signal représenté, calcule sa valeur moyenne en supposant une tension basse nulle.','math']},
c05:{title:'Évaluer la fiabilité',graph:{x:'Temps (ms)',y:'Tension (V)',xs:[0,1,2,3,4,5,6,7,8,9,10],ys:[0.5,0.7,1.2,1.7,2.1,1.8,2.2,1.6,2.4,2.6,2.5],lo:0,hi:3},core:[
['a','Les seuils fictifs sont 0,8 V et 2 V. Repère deux instants pour lesquels aucun état logique n’est garanti et justifie.','graph'],
['b','Explique pourquoi le bruit peut provoquer plusieurs commutations au voisinage d’un seuil.'],
['c','Propose une méthode pour limiter ces commutations et précise une limite de cette méthode.']],
reinforce:['r','Compare les états garantis pour 0,5 V, 1,5 V et 2,5 V avec les seuils donnés. Justifie les trois cas.'],
transfer:['t','Un détecteur doit éviter un allumage intempestif. Propose deux seuils distincts et explique comment le système décide entre allumer et éteindre.'],
extra:['e','Propose une expérience permettant de comparer un signal bruité à un signal filtré.']},
c06:{title:'Expérimenter et valider',graph:{x:'Position du potentiomètre (%)',y:'Tension (V)',xs:[0,25,50,75,100],ys:[0,1.20,2.48,3.76,4.96],lo:0,hi:5},core:[
['a','Le modèle idéal prévoit 5 V à 100 %. Sur les mesures simulées, relève la tension à 50 % et compare-la à la prévision.','graph'],
['b','Propose deux causes possibles de l’écart et une vérification concrète pour chacune.'],
['c','Explique pourquoi une simulation ne suffit pas à prouver le comportement d’un montage réel.']],
reinforce:['r','Écris la relation idéale entre la position du potentiomètre exprimée en fraction et la tension. Calcule la tension à 25 %.','math'],
transfer:['t','Détermine l’écart absolu à 100 %, puis propose une méthode pour vérifier s’il est compatible avec les incertitudes de mesure.','graph'],
extra:['e','Décris les conditions de mesure que tu noterais pour qu’un autre élève puisse reproduire l’expérience.']},
c07:{title:'Préparer la numérisation',graph:{x:'Temps (ms)',y:'Tension (V)',xs:[0,1,2,3,4,5,6,7,8],ys:[1.5,2.2,2.5,2.2,1.5,0.8,0.5,0.8,1.5],lo:0,hi:3},core:[
['a','Relève les tensions aux instants 1 ms et 3 ms. Explique pourquoi il faut préciser l’instant de chaque mesure.','graph'],
['b','Explique la différence entre choisir quand mesurer une tension et choisir comment représenter sa valeur numériquement.'],
['c','Un système stocke seulement des valeurs à 0, 4 et 8 ms. Explique quelle information risque de disparaître en t’appuyant sur la courbe.','graph']],
reinforce:['r','Décris les étapes qui permettent de passer d’une tension continue dans le temps à des codes numériques mémorisables.'],
transfer:['t','Propose deux acquisitions du même signal avec des intervalles de mesure différents. Explique ce que changerait la diminution de cet intervalle.','math'],
extra:['e','Explique pourquoi mesurer plus souvent et représenter les amplitudes plus finement répondent à deux problèmes différents.']}
};
const numMap={"v25-temp-0":{"expected":50,"tol":1},"v25-temp-1":{"expected":20,"tol":1},"v25-temp-2":{"expected":50,"tol":1},"v25-temp-3":{"expected":2.25,"tol":0.08},"v25-light-0":{"expected":800,"tol":20},"v25-light-1":{"expected":100,"tol":20},"v25-light-2":{"expected":14,"tol":0.25},"v25-light-3":{"expected":0.6,"tol":0.06},"v25-sound-0":{"expected":2.9,"tol":0.08},"v25-sound-1":{"expected":0.4,"tol":0.08},"v25-sound-2":{"expected":0.5,"tol":0.08},"v25-sound-3":{"expected":1.65,"tol":0.06},"v25-press-0":{"expected":4,"tol":0.1},"v25-press-1":{"expected":5,"tol":0.15},"v25-press-2":{"expected":8,"tol":0.15},"v25-press-3":{"expected":1,"tol":0.06},"v25-dist-0":{"expected":20,"tol":2},"v25-dist-1":{"expected":5,"tol":0.15},"v25-dist-2":{"expected":7,"tol":0.15},"v25-dist-3":{"expected":1.2,"tol":0.06},"v25-speed-0":{"expected":1200,"tol":30},"v25-speed-1":{"expected":5,"tol":0.15},"v25-speed-2":{"expected":8,"tol":0.15},"v25-speed-3":{"expected":1.2,"tol":0.06},"v25-temp-c-0":{"expected":30,"tol":0.01},"v25-temp-c-1":{"expected":0.6,"tol":0.005},"v25-temp-c-2":{"expected":1.9,"tol":0.005},"v25-temp-c-3":{"expected":42,"tol":0.05},"v25-light-c-0":{"expected":500,"tol":0.5},"v25-light-c-1":{"expected":0.6,"tol":0.005},"v25-sound-c-0":{"expected":2.5,"tol":0.005},"v25-sound-c-1":{"expected":1.6,"tol":0.005},"v25-press-c-0":{"expected":0.5,"tol":0.005},"v25-press-c-1":{"expected":2,"tol":0.005},"v25-press-c-2":{"expected":2.5,"tol":0.005},"v25-dist-c-0":{"expected":70,"tol":0.05},"v25-dist-c-1":{"expected":14,"tol":0.05},"v25-speed-c-0":{"expected":40,"tol":0.05},"v25-speed-c-1":{"expected":1200,"tol":0.5},"v25-pwm-c-0":{"expected":250,"tol":0.1},"v25-pwm-c-1":{"expected":37.5,"tol":0.05},"v25-pwm-c-2":{"expected":1.2375,"tol":0.005},"v25-pwm-read-0":{"expected":4,"tol":0.1},"v25-pwm-read-1":{"expected":1.5,"tol":0.08},"v25-pwm-read-2":{"expected":3.3,"tol":0.08},"v25-pwm-read-3":{"expected":0,"tol":0.05},"v25-tach-read-0":{"expected":25,"tol":1},"v25-tach-read-1":{"expected":5,"tol":1},"v25-tach-read-2":{"expected":3.3,"tol":0.08}};
function selectQuestions(id,root){
 const b=bank[id],fields=[...root.querySelectorAll('[data-answer]')], nums=fields.filter(f=>f.hasAttribute('data-numeric'));
 let wrong=0,unanswered=0;for(const f of nums){const v=f.value.trim().replace(',','.'),rule=numMap[f.id];if(!v){unanswered++;continue}if(!rule||!/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?$/i.test(v)||!Number.isFinite(Number(v))||Math.abs(Number(v)-rule.expected)>rule.tol+1e-10)wrong++}
 const open=fields.filter(f=>f.hasAttribute('data-transfer')), missing=open.some(f=>!f.value.trim());
 // Completion is evidence availability, not evidence of mastery.
 const insufficient=missing||unanswered>0, fragile=wrong>0;
 return {ids:[...b.core.map(q=>q[0]),fragile||insufficient?'r':'t',...(fragile||insufficient?['e']:[])],reason:fragile?'Des résultats numériques sont à revoir.':insufficient?'Des éléments de réponse sont manquants.':'Données disponibles ; compréhension ouverte non évaluée.',counts:{wrong,unanswered,transferMissing:missing},source:Object.fromEntries(fields.map(f=>[f.id,f.value]))};
}
const NS='http://www.w3.org/1998/Math/MathML';
function mathNode(tag,text){const m=document.createElementNS(NS,tag);if(text!==undefined)m.textContent=text;return m}
function addFormula(container,target){
 const box=el('div',undefined,'v28-formula');box.hidden=true;
 const mode=el('select');mode.setAttribute('aria-label','Type de formule');
 for(const [v,t] of [['frac','Fraction'],['power','Puissance'],['sub','Indice'],['root','Racine carrée']]){const o=el('option',t);o.value=v;mode.append(o)}
 const a=el('input');a.maxLength=80;a.type='text';a.setAttribute('aria-label','Premier terme');const b=el('input');b.maxLength=80;b.type='text';b.setAttribute('aria-label','Second terme');
 const la=el('label','Numérateur');la.append(a);const lb=el('label','Dénominateur');lb.append(b);const preview=mathNode('math');preview.setAttribute('aria-label','Aperçu de la formule');
 const label=(l,t)=>{l.firstChild.nodeValue=t};
 function update(){const m=mode.value;label(la,m==='frac'?'Numérateur':m==='root'?'Sous la racine':'Base');label(lb,m==='frac'?'Dénominateur':m==='sub'?'Indice':'Exposant');lb.hidden=m==='root';const node=mathNode({frac:'mfrac',power:'msup',sub:'msub',root:'msqrt'}[m]);node.append(mathNode('mtext',a.value||'□'));if(m!=='root')node.append(mathNode('mtext',b.value||'□'));preview.replaceChildren(node)}
 function insert(t){const from=target.selectionStart,to=target.selectionEnd;target.setRangeText(t,from,to,'end');target.dispatchEvent(new Event('input',{bubbles:true}));target.focus()}
 const safe=v=>v.replace(/[\\{}$%#&]/g,'').trim();
 box.append(el('strong','Composer une formule'),mode,la,lb,preview,btn('Insérer la formule',()=>{const x=safe(a.value),y=safe(b.value);if(!x||(mode.value!=='root'&&!y))return;const m=mode.value,t=m==='frac'?'\\frac{'+x+'}{'+y+'}':m==='root'?'\\sqrt{'+x+'}':m==='power'?'{'+x+'}^{'+y+'}':'{'+x+'}_{'+y+'}';insert(' \\('+t+'\\) ')}));
 [mode,a,b].forEach(e=>e.addEventListener('input',update));update();
 const answerPreview=el('div',undefined,'v28-answer-math');answerPreview.setAttribute('aria-label','Aperçu des formules insérées');function renderAnswer(){answerPreview.replaceChildren();const re=/\\\(([^]*?)\\\)/g;for(const m of target.value.matchAll(re)){const v=m[1];const frac=v.match(/^\\frac\{([^{}]+)\}\{([^{}]+)\}$/),root=v.match(/^\\sqrt\{([^{}]+)\}$/),pow=v.match(/^\{([^{}]+)\}([_^])\{([^{}]+)\}$/);const math=mathNode('math');if(frac){const n=mathNode('mfrac');n.append(mathNode('mtext',frac[1]),mathNode('mtext',frac[2]));math.append(n)}else if(root){const n=mathNode('msqrt');n.append(mathNode('mtext',root[1]));math.append(n)}else if(pow){const n=mathNode(pow[2]==='^'?'msup':'msub');n.append(mathNode('mtext',pow[1]),mathNode('mtext',pow[3]));math.append(n)}else{continue}answerPreview.append(math)}answerPreview.hidden=!answerPreview.childNodes.length}target.addEventListener('input',renderAnswer);renderAnswer();const bar=el('div',undefined,'v28-tools');bar.append(btn('Formule mathématique',()=>{box.hidden=!box.hidden;if(!box.hidden)mode.focus()}));
 for(const symbol of ['Δ','×','÷','²','θ','µ','Ω','≈','≤','≥'])bar.append(btn(symbol,()=>insert(symbol)));
 container.append(bar,box,answerPreview);
}
const SVG='http://www.w3.org/2000/svg';
function sv(tag,attrs={},txt){const n=document.createElementNS(SVG,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(txt!==undefined)n.textContent=txt;return n}
function graph(container,target,g){
 const wrap=el('div',undefined,'v28-graph');wrap.append(el('strong','Courbe simulée — deux curseurs de mesure'));
 const svg=sv('svg',{viewBox:'0 0 600 270',role:'img','aria-label':g.y+' en fonction de '+g.x+' ; utilisez les deux curseurs sous le graphique.'});
 const X=x=>65+510*(x-g.xs[0])/(g.xs.at(-1)-g.xs[0]),Y=y=>220-185*(y-g.lo)/(g.hi-g.lo);
 for(let i=0;i<=5;i++){const y=g.lo+(g.hi-g.lo)*i/5;svg.append(sv('line',{x1:65,x2:575,y1:Y(y),y2:Y(y),stroke:'#ddd5c5'}),sv('text',{x:58,y:Y(y)+4,'text-anchor':'end','font-size':12,fill:'#332b23'},Number(y.toFixed(2)).toString()))}
 for(let i=0;i<g.xs.length;i++){if(g.xs.length>10&&i%2)continue;const x=g.xs[i];svg.append(sv('line',{x1:X(x),x2:X(x),y1:35,y2:220,stroke:'#e9e1d2'}),sv('text',{x:X(x),y:237,'text-anchor':'middle','font-size':12,fill:'#332b23'},String(x)))}
 svg.append(sv('path',{d:'M65 35V220H575',fill:'none',stroke:'#332b23','stroke-width':2}),sv('text',{x:65,y:19,'font-size':14,fill:'#332b23'},g.y),sv('text',{x:575,y:260,'text-anchor':'end','font-size':14,fill:'#332b23'},g.x));
 let path='M'+X(g.xs[0])+' '+Y(g.ys[0]);for(let i=1;i<g.xs.length;i++)path+=g.step?'H'+X(g.xs[i])+'V'+Y(g.ys[i]):'L'+X(g.xs[i])+' '+Y(g.ys[i]);
 svg.append(sv('path',{d:path,fill:'none',stroke:'#42734a','stroke-width':3}));
 const cursors=['A','B'].map((name,i)=>{const line=sv('line',{y1:35,y2:220,stroke:i?'#a34b20':'#245ca0','stroke-width':2,'stroke-dasharray':i?'7 3':'3 3'}),dot=sv('circle',{r:5,fill:i?'#a34b20':'#245ca0'});svg.append(line,dot);const slider=el('input');slider.type='range';slider.min=0;slider.max=g.xs.length-1;slider.value=i?g.xs.length-1:0;slider.setAttribute('aria-label','Curseur '+name);const label=el('label','Curseur '+name);label.append(slider);return{name,line,dot,slider,label}});
 const read=el('output');read.setAttribute('aria-live','polite');
 const values=()=>cursors.map(c=>{const i=Number(c.slider.value);return {name:c.name,x:g.xs[i],y:g.ys[i]}});
 const format=v=>v.map(p=>p.name+' : '+g.x+' = '+p.x+' ; '+g.y+' = '+p.y).join(' | ');
 function redraw(){const v=values();cursors.forEach((c,i)=>{c.line.setAttribute('x1',X(v[i].x));c.line.setAttribute('x2',X(v[i].x));c.dot.setAttribute('cx',X(v[i].x));c.dot.setAttribute('cy',Y(v[i].y))});read.textContent=format(v)}
 cursors.forEach(c=>c.slider.addEventListener('input',redraw));wrap.append(svg,...cursors.map(c=>c.label),read,btn('Insérer les relevés dans ma réponse',()=>{target.value+=(target.value?'\n':'')+format(values()).replaceAll(' | ','\n');target.dispatchEvent(new Event('input',{bubbles:true}));target.focus()}));container.append(wrap);redraw();
}
function render(id){
 const root=$(id),b=bank[id],old=root.querySelector('.v28-panel');if(old)old.remove();
 const panel=el('div',undefined,'v28-panel'),head=el('h3','Ai-je réellement compris ?');head.id='v28-'+id+'-heading';panel.setAttribute('role','region');panel.setAttribute('aria-labelledby',head.id);
 panel.append(head,el('p','Réponds avec tes propres mots, justifie tes calculs et appuie-toi sur les courbes si nécessaire. Aucune durée imposée.'),el('p','Prototype : sélection locale selon les données disponibles ; aucun diagnostic Mistral.','v28-warning'));
 const status=el('p',undefined,'v28-status');status.setAttribute('role','status');
 const list=el('div');const start=btn(state[id]?'Reprendre mon bilan':'Préparer mon bilan',()=>{if(!state[id]){const sel=selectQuestions(id,root);state[id]={...sel,answers:{},submitted:false};persist()}draw()});
 const restart=btn('Recommencer avec les réponses actuelles',()=>{if(state[id]&&!confirm('Réinitialiser seulement ce bilan ? Les exercices précédents restent conservés.'))return;delete state[id];const sel=selectQuestions(id,root);state[id]={...sel,answers:{},submitted:false};persist();draw()});
 const send=btn('Terminer le bilan local',()=>{const s=state[id];if(!s||s.ids.some(q=>!String(s.answers[q]||'').trim())){status.textContent='Réponds à toutes les questions avant de terminer.';return}s.submitted=true;s.completedAt=new Date().toISOString();status.textContent=persist()?'Bilan enregistré sur cet appareil. Aucune transmission enseignant ni analyse IA.':'Stockage indisponible : utilise l’export JSON.';draw()});
 const exportBtn=btn('Exporter mon bilan (JSON)',()=>{if(!state[id])return;const data={schema_version:'canlab-v28-preview-1',chapter:id,version:'28-prototype',analysis_status:'not_evaluated',...state[id]};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=el('a');a.href=url;a.download='canlab-v28-'+id+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
 function draw(){const s=state[id];list.replaceChildren();if(!s)return;start.hidden=true;restart.hidden=false;send.hidden=false;exportBtn.hidden=false;status.textContent=s.submitted?'Bilan terminé localement ; maîtrise non évaluée.':s.reason+' '+s.ids.length+' questions ouvertes.';
 const all=[...b.core,b.reinforce,b.transfer,b.extra];for(const [i,qid] of s.ids.entries()){const q=all.find(x=>x[0]===qid);if(!q)continue;const row=el('fieldset',undefined,'v28-question');row.append(el('legend',(i+1)+'. '+q[1]));const input=el('textarea');input.id='v28-'+id+'-'+qid;input.maxLength=4000;input.setAttribute('aria-label','Réponse à la question '+(i+1));input.value=s.answers[qid]||'';input.placeholder='Décris ton raisonnement, tes calculs et tes unités…';input.addEventListener('input',()=>{s.answers[qid]=input.value;s.submitted=false;persist();status.textContent='Brouillon local — maîtrise non évaluée.'});row.append(input);addFormula(row,input);if(q[2]==='graph'&&b.graph)graph(row,input,b.graph);list.append(row)}}
 restart.hidden=send.hidden=exportBtn.hidden=true;panel.append(start,restart,list,send,exportBtn,status);const checkpoint=root.querySelector('.checkpoint');if(checkpoint)checkpoint.after(panel);else root.append(panel);if(state[id])draw();
}
Object.keys(bank).forEach(render);
})();
