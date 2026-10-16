Attempting to perform the InitializeDefaultDrives operation on the 'FileSystem' provider failed.
(function(){
  const params=new URLSearchParams(location.search);
  if((params.get('ruta')||'').toLowerCase()!=='start-v0-4') return;
  const lessons=[
    ['Descubre qué es la IA','Entiende qué es la inteligencia artificial y para qué puede ayudarte.','/assets/start/v0.4/l01/START_L01_infografia_v0.1.webp'],
    ['Tu primer asistente de IA','Aprende a conversar con una herramienta de IA con un objetivo claro.','/assets/start/v0.4/l02/START_L02_infografia_v0.1.webp'],
    ['Cómo escribir mejores instrucciones','Convierte una petición general en una instrucción útil y concreta.','/assets/start/v0.4/l03/START_L03_infografia_v0.1.webp'],
    ['Tres pasos para mejorar una respuesta','Revisa el borrador, pide una mejora y comprueba la versión útil.','/assets/start/v0.4/l04/START_L04_infografia_v0.2.webp'],
    ['Trabajar con documentos y fuentes','Organiza la información que necesita la IA para responder mejor.','/assets/start/v0.4/l05/START_L05_infografia_v0.1.webp'],
    ['Imágenes y creatividad con IA','Usa la IA para explorar ideas visuales con intención.','/assets/start/v0.4/l06/START_L06_infografia_v0.1.webp'],
    ['IA responsable en la práctica','Aplica criterios de privacidad, revisión y uso responsable.','/assets/start/v0.4/l07/START_L07_infografia_v0.1.webp'],
    ['Tu primer proyecto completo con IA','Integra lo aprendido en un flujo de trabajo sencillo y evaluable.','/assets/start/v0.4/l08/START_L08_infografia_v0.1.webp']
  ];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const render=()=>{
    const app=document.querySelector('#route-app');
    if(!app||app.querySelector('.route-hero h1 span')?.textContent==='START v0.4') return;
    const card=(x,i)=>`<a class="lesson-card" style="--lesson-color:#18a889" href="/start-v0.4-leccion.html?leccion=${i+1}"><span class="lesson-number">${i+1}</span><img class="lesson-image" src="${x[2]}" alt="${esc(x[0])}" loading="lazy"><div><span class="lesson-kicker">LECCIÓN ${i+1}</span><h3>${esc(x[0])}</h3><p>${esc(x[1])}</p></div><span class="status">CANDIDATA</span></a>`;
    app.innerHTML=`<section class="route-hero"><img class="route-hero-image" src="/assets/ruta-start-v1.png" alt="Mentor de la ruta START v0.4"><div class="route-hero-copy"><p class="eyebrow">RUTA CANDIDATA</p><h1>RUTA <span>START v0.4</span></h1><p class="route-level">Versión candidata · 8 lecciones</p><p>Ocho lecciones para empezar a trabajar con inteligencia artificial de forma práctica.</p><a class="neon-button hero-action" href="/start-v0.4-leccion.html?leccion=1">▶ &nbsp; Ver la Lección 1</a></div></section><div class="panel" style="margin:18px 0;border-color:#18a889"><strong>EN PRUEBAS · versión candidata</strong><p style="margin:8px 0 0">El contenido está preparado para revisión técnica. La ruta aún no está publicada para alumnos ni conectada al progreso del Campus.</p></div><section class="summary-grid"><div class="summary-card"><div class="summary-icon">▤</div><div><strong>8</strong><span>lecciones en esta ruta</span></div></div><div class="summary-card"><div class="summary-icon">✓</div><div><strong>0</strong><span>lecciones completadas</span></div></div><div class="summary-card"><div class="summary-icon">◔</div><div><strong>0%</strong><span>progreso de la ruta</span></div></div><div class="summary-card"><div class="summary-icon">★</div><div><strong>—</strong><span>insignia provisional</span></div></div></section><section class="panel" id="itinerary"><div class="panel-title"><h2>Tu itinerario de aprendizaje</h2><p>Contenido editorial aprobado, pendiente de publicación técnica.</p></div><div class="lesson-list">${lessons.map(card).join('')}</div></section><section class="next-step"><p class="eyebrow" style="color:#9a6d00">SIGUIENTE PASO</p><div class="next-inner"><img src="${lessons[0][2]}" alt="${esc(lessons[0][0])}"><div><h2>Comienza con la Lección 1</h2><p>${esc(lessons[0][0])}</p><a class="neon-button" href="/start-v0.4-leccion.html?leccion=1">Abrir lección →</a></div></div></section>`;
    const cta=document.querySelector('#assessment-cta');
    if(cta){cta.style.display='block';const link=cta.querySelector('#assessment-link');link.href='/start-v0.4-evaluacion.html';link.textContent='Abrir evaluación candidata →';}
  };
  new MutationObserver(render).observe(document.documentElement,{childList:true,subtree:true});
  render();
})();

