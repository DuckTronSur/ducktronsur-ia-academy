/* Navegación móvil piloto: estado real de Supabase, sin simular inicio de sesión. */
(function(){
'use strict';
function init(){
  const toggle=document.getElementById('academy-mobile-toggle');
  const menu=document.getElementById('academy-mobile-menu');
  const shortcut=document.getElementById('academy-campus-shortcut');
  if(!toggle||!menu||!shortcut)return;
  const members=menu.querySelectorAll('[data-member-only]');
  const guests=menu.querySelectorAll('[data-guest-only]');
  const logout=document.getElementById('academy-mobile-logout');
  let supa=null;
  function apply(user){
    members.forEach(el=>{el.hidden=!user});
    guests.forEach(el=>{el.hidden=!!user});
    shortcut.hidden=!user;
  }
  function close(){menu.hidden=true;toggle.setAttribute('aria-expanded','false');}
  toggle.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  document.addEventListener('click',e=>{if(!menu.hidden&&!menu.contains(e.target)&&!toggle.contains(e.target))close()});
  apply(null);
  if(!window.supabase||!window.SUPABASE_URL||!window.SUPABASE_PUBLISHABLE_KEY)return;
  supa=window.__academySessionClient||window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY);
  supa.auth.getUser().then(({data,error})=>{if(!error)apply(data?.user||null)}).catch(()=>apply(null));
  supa.auth.onAuthStateChange((_event,session)=>apply(session?.user||null));
  logout?.addEventListener('click',async()=>{
    logout.disabled=true;
    try{const {error}=await supa.auth.signOut();if(error)throw error;apply(null);close();location.assign('/');}
    catch(e){alert('No se pudo cerrar la sesión. Vuelve a intentarlo.');logout.disabled=false;}
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
