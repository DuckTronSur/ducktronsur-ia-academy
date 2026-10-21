/* Navegación común y estado de sesión del Campus. */
(function(){
'use strict';
let resolveSessionReady;
if(!window.__academySessionReady){
  window.__academySessionReady=new Promise(resolve=>{resolveSessionReady=resolve});
  window.__academyResolveSessionReady=resolveSessionReady;
}else resolveSessionReady=window.__academyResolveSessionReady;
function initials(label){
  return String(label||'?').trim().split(/\s+/).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'?';
}
function init(){
  const toggle=document.getElementById('academy-mobile-toggle');
  const menu=document.getElementById('academy-mobile-menu');
  const shortcut=document.getElementById('academy-campus-shortcut');
  const nav=document.querySelector('.academy-header .academy-nav');
  if(!toggle||!menu||!shortcut||!nav)return;
  const members=menu.querySelectorAll('[data-member-only]');
  const guests=menu.querySelectorAll('[data-guest-only]');
  const logout=document.getElementById('academy-mobile-logout');
  let supa=null;
  let userMenu=null;

  function createUserMenu(){
    if(userMenu||!nav)return;
    userMenu=document.createElement('div');
    userMenu.className='academy-user-menu';
    userMenu.hidden=true;
    userMenu.innerHTML='<button class="academy-user-trigger" type="button" aria-expanded="false" aria-controls="academy-user-panel"><span class="academy-avatar" data-avatar aria-hidden="true"></span><span class="academy-user-name" data-user-name>Mi cuenta</span><span class="academy-user-badge" data-user-badge hidden></span><span class="academy-user-chevron" aria-hidden="true">⌄</span></button><div class="academy-user-panel" id="academy-user-panel" hidden><p class="academy-user-panel-title">Tus accesos</p><a class="academy-access-card" href="/mi-campus.html"><img src="/assets/ducktronsur-ia-academy-hero-v2.png" alt=""><span><strong>Mi Campus</strong><small>Tu espacio de aprendizaje</small></span></a><a class="academy-access-card" href="/prompteca.html"><img src="/assets/prompteca-visual-kit-web/categoria-chatgpt-ia-general.jpg" alt=""><span><strong>Prompteca</strong><small>Prompts y recursos</small></span></a><a class="academy-access-card" href="/pildoras.html"><img src="/assets/pildoras-ia-hero.webp" alt=""><span><strong>Píldoras IA</strong><small>Contenidos prácticos</small></span></a><a class="academy-access-card" href="/empresas.html"><img src="/assets/empresas/DuckTronSur_Guia_Empresas_L01_oportunidades_v0.1.png" alt=""><span><strong>Guía para empresas</strong><small>IA aplicada a una pyme</small></span></a><a class="academy-access-card" href="/perfil.html"><img src="/assets/auth-login-campus.jpg" alt=""><span><strong>Perfil</strong><small>Cuenta y datos personales</small></span></a><a class="academy-access-card" href="https://chat.whatsapp.com/DeI65xZLzYA47fKKAjiCee" target="_blank" rel="noopener"><img src="/assets/campus/Campus%20012%20Avatar%20Comunidad%20WhatsApp.png" alt=""><span><strong>Comunidad</strong><small>WhatsApp de DuckTronSur</small></span></a><button type="button" data-desktop-logout>Cerrar sesión</button></div>';
    nav.appendChild(userMenu);
    const trigger=userMenu.querySelector('.academy-user-trigger');
    const panel=userMenu.querySelector('.academy-user-panel');
    const close=()=>{panel.hidden=true;trigger.setAttribute('aria-expanded','false')};
    trigger.addEventListener('click',event=>{event.stopPropagation();const open=panel.hidden;panel.hidden=!open;trigger.setAttribute('aria-expanded',String(open))});
    document.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
    document.addEventListener('click',event=>{if(!userMenu.hidden&&!userMenu.contains(event.target))close()});
    userMenu.querySelector('[data-desktop-logout]').addEventListener('click',async()=>{
      if(!supa)return;
      const button=userMenu.querySelector('[data-desktop-logout]');
      button.disabled=true;
      try{const result=await supa.auth.signOut();if(result.error)throw result.error;apply(null)}catch(error){button.disabled=false;alert('No se pudo cerrar la sesión. Vuelve a intentarlo.')}
    });
  }

  function setAvatar(root,label,url){
    const avatar=root.querySelector('[data-avatar]');
    if(!avatar)return;
    avatar.textContent='';
    if(url){
      const image=document.createElement('img');
      image.src=url;image.alt='';image.loading='lazy';
      avatar.appendChild(image);
    }else avatar.textContent=initials(label);
  }
  async function resolveAccountLabel(user,profile){
    if(profile?.role==='admin')return 'Administrador';
    try{
      const result=await supa.from('access_grants').select('source,status').eq('user_id',user.id).eq('status','active');
      if((result.data||[]).some(grant=>grant.source==='founder_lifetime'))return 'Alumno vitalicio';
    }catch(error){}
    return 'Alumno';
  }
  function setAccountBadge(root,label){
    const badge=root.querySelector('[data-user-badge]');
    if(!badge)return;
    badge.textContent=label||'';
    badge.hidden=!label;
  }
  async function apply(user){
    members.forEach(el=>{el.hidden=!user});
    guests.forEach(el=>{el.hidden=!!user});
    shortcut.hidden=!user;
    const accessLinks=nav.querySelectorAll('.academy-links .academy-access');
    const campusLinks=nav.querySelectorAll('.academy-links a[href="/mi-campus.html"]');
    accessLinks.forEach(el=>{el.hidden=!!user});
    campusLinks.forEach(el=>{el.hidden=!!user});
    createUserMenu();
    if(!user){userMenu.hidden=true;return}
    userMenu.hidden=false;
    const label=user.user_metadata?.display_name||user.email||'Mi cuenta';
    userMenu.querySelector('[data-user-name]').textContent=label;
    let profile=null;
    try{
      const result=await supa.from('profiles').select('display_name,avatar_path,role').eq('id',user.id).maybeSingle();
      profile=result.data||null;
    }catch(error){}
    const profileLabel=profile?.display_name||label;
    let avatarUrl='';
    if(profile?.avatar_path){
      try{
        const signed=await supa.storage.from('avatars').createSignedUrl(profile.avatar_path,3600);
        avatarUrl=signed.data?.signedUrl||'';
      }catch(error){}
    }
    userMenu.querySelector('[data-user-name]').textContent=profileLabel;
    setAvatar(userMenu,profileLabel,avatarUrl);
    setAccountBadge(userMenu,'Alumno');
    resolveAccountLabel(user,profile).then(label=>setAccountBadge(userMenu,label)).catch(()=>{});
  }
  function closeMobile(){menu.hidden=true;toggle.setAttribute('aria-expanded','false')}
  toggle.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open))});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMobile()});
  document.addEventListener('click',event=>{if(!menu.hidden&&!menu.contains(event.target)&&!toggle.contains(event.target))closeMobile()});
  apply(null);
  let attempts=0;
  function connect(){
    if(supa)return;
    if(!window.supabase||!window.SUPABASE_URL||!window.SUPABASE_PUBLISHABLE_KEY){
      if(++attempts<100)setTimeout(connect,100);
      return;
    }
    supa=window.__academySessionClient||window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY);window.__academySessionClient=supa;
    if(window.__academySessionStarted){
      window.__academySessionReady.then(user=>apply(user));
    }else{
      window.__academySessionStarted=true;
      supa.auth.getSession().then(({data,error})=>{const user=!error?data?.session?.user||null:null;window.__academyResolveSessionReady?.(user);if(!error)apply(user);else apply(null);return user}).catch(()=>{window.__academyResolveSessionReady?.(null);apply(null);return null});
    }
    supa.auth.onAuthStateChange((_event,session)=>apply(session?.user||null));
  }
  connect();
  logout?.addEventListener('click',async()=>{
    if(!supa)return;
    logout.disabled=true;
    try{const result=await supa.auth.signOut();if(result.error)throw result.error;apply(null);closeMobile();location.assign('/')}
    catch(error){alert('No se pudo cerrar la sesión. Vuelve a intentarlo.');logout.disabled=false}
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();