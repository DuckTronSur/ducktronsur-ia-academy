(() => {
  const CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.1/dist/umd/supabase.min.js';
  const loadScript = src => new Promise((resolve, reject) => { const script = document.createElement('script'); script.src = src; script.onload = resolve; script.onerror = reject; document.head.appendChild(script); });
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  const displayName = user => user.user_metadata?.display_name || user.email?.split('@')[0] || 'Usuario';
  const initials = user => displayName(user).split(/[\s._-]+/).filter(Boolean).slice(0,2).map(part => part[0]).join('').toUpperCase() || 'U';
  const sessionHost = () => document.querySelector('.academy-links,.nav-links,.campus-nav-links,.nav-tools,.campus-nav,.auth-top') || document.body;
  const tidyNavigation = root => {
    document.querySelectorAll('.academy-access,.nav-access').forEach(element => { if (!root.contains(element)) element.hidden = true; });
    document.querySelectorAll('.academy-links a[href="/mi-campus.html"],.nav-links a[href="/mi-campus.html"]').forEach(element => { if (!root.contains(element)) element.hidden = true; });
  };
  const favorites = [
    ['data:image/png;base64,Attempting to perform the InitializeDefaultDrives operation on the 'FileSystem' provider failed.
MethodInvocationException: 
Line |
   2 |  [Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\Users\JCueto\.c …
     |  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     | Exception calling "ReadAllBytes" with "1" argument(s): "Could not find a part of the path 'C:\Users\JCueto\.codex\.chatgpt-projects\g-p-6ab5861aaa7081918be16ad8f9c428cb\campus-source-backup\site\session-tiles\DuckTronSur_Tile_Mi_Campus_v0.1_97.png'."','Mi Campus','Tu espacio de aprendizaje','/mi-campus.html'],
    ['data:image/png;base64,Attempting to perform the InitializeDefaultDrives operation on the 'FileSystem' provider failed.
MethodInvocationException: 
Line |
   2 |  [Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\Users\JCueto\.c …
     |  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     | Exception calling "ReadAllBytes" with "1" argument(s): "Could not find a part of the path 'C:\Users\JCueto\.codex\.chatgpt-projects\g-p-6ab5861aaa7081918be16ad8f9c428cb\campus-source-backup\site\session-tiles\DuckTronSur_Tile_Prompteca_v0.1_97.png'."','Prompteca','Prompts y recursos reutilizables','/prompteca.html'],
    ['data:image/png;base64,Attempting to perform the InitializeDefaultDrives operation on the 'FileSystem' provider failed.
MethodInvocationException: 
Line |
   2 |  [Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\Users\JCueto\.c …
     |  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     | Exception calling "ReadAllBytes" with "1" argument(s): "Could not find a part of the path 'C:\Users\JCueto\.codex\.chatgpt-projects\g-p-6ab5861aaa7081918be16ad8f9c428cb\campus-source-backup\site\session-tiles\DuckTronSur_Tile_Pildoras_IA_v0.1_97.png'."','Píldoras IA','Contenidos breves y prácticos','/pildoras.html'],
    ['data:image/png;base64,Attempting to perform the InitializeDefaultDrives operation on the 'FileSystem' provider failed.
MethodInvocationException: 
Line |
   2 |  [Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\Users\JCueto\.c …
     |  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     | Exception calling "ReadAllBytes" with "1" argument(s): "Could not find a part of the path 'C:\Users\JCueto\.codex\.chatgpt-projects\g-p-6ab5861aaa7081918be16ad8f9c428cb\campus-source-backup\site\session-tiles\DuckTronSur_Tile_Guia_para_empresas_v0.1_97.png'."','Guía para empresas','IA aplicada a una pyme','/ia-para-empresas.html'],
    ['👤','Perfil profesional','Datos y perfil de usuario','/perfil.html'],
    ['data:image/png;base64,Attempting to perform the InitializeDefaultDrives operation on the 'FileSystem' provider failed.
MethodInvocationException: 
Line |
   2 |  [Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\Users\JCueto\.c …
     |  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     | Exception calling "ReadAllBytes" with "1" argument(s): "Could not find a part of the path 'C:\Users\JCueto\.codex\.chatgpt-projects\g-p-6ab5861aaa7081918be16ad8f9c428cb\campus-source-backup\site\session-tiles\DuckTronSur_Tile_Comunidad_WhatsApp_v0.1_97.png'."','Comunidad','WhatsApp de DuckTronSur','https://chat.whatsapp.com/DeI65xZLzYA47fKKAjiCee']
  ];
  const closeMenu = root => {
    root.querySelectorAll('[aria-expanded="true"]').forEach(button => button.setAttribute('aria-expanded','false'));
    root.querySelectorAll('.global-session-menu:not([hidden])').forEach(menu => { menu.hidden = true; });
  };
  const bindMenu = root => {
    const menu = root.querySelector('.global-session-menu');
    const toggle = button => {
      const next = button.getAttribute('aria-expanded') !== 'true';
      closeMenu(root);
      if (next) { button.setAttribute('aria-expanded','true'); menu.hidden = false; }
    };
    root.querySelectorAll('.global-session-toggle').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); toggle(button); }));
    root.querySelector('.global-session-logout').addEventListener('click', async event => {
      const button = event.currentTarget; button.disabled = true; button.textContent = 'Cerrando…';
      const { error } = await window.__academySessionClient.auth.signOut({ scope: 'local' });
      if (error) { button.disabled = false; button.textContent = 'Reintentar'; return; }
      location.href = '/auth.html';
    });
    document.addEventListener('click', event => { if (!root.contains(event.target)) closeMenu(root); }, { once: true });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(root); }, { once: true });
  };
  const render = user => {
    let root = document.querySelector('#global-session-ui');
    const host = sessionHost();
    if (!root) { root = document.createElement('aside'); root.id = 'global-session-ui'; root.className = 'global-session-ui'; }
    if (!host.contains(root)) { host.classList.add('global-session-host'); host.appendChild(root); }
    if (!user) { root.hidden = true; return; }
    tidyNavigation(root);
    const name = displayName(user);
    const cards = favorites.map(([visual,title,description,href]) => { const icon = visual.startsWith('/') ? '<img class="global-session-favorite-image" src="' + visual + '" alt="" loading="lazy" width="38" height="38">' : '<span class="global-session-favorite-icon">' + visual + '</span>'; return '<a class="global-session-favorite" href="' + href + '"' + (href.startsWith('http') ? ' target="_blank" rel="noopener"' : '') + '>' + icon + '<span><strong>' + title + '</strong><small>' + description + '</small></span></a>'; }).join('');
    root.hidden = false;
    root.innerHTML = '<button class="global-session-toggle global-session-apps" type="button" aria-expanded="false" aria-controls="global-session-menu" title="Tus accesos">⠿</button>' +
      '<button class="global-session-toggle global-session-profile" type="button" aria-expanded="false" aria-controls="global-session-menu"><span class="global-session-avatar" aria-hidden="true">' + escapeHtml(initials(user)) + '</span><span class="global-session-copy"><strong>' + escapeHtml(name) + '</strong><small>Sesión iniciada</small></span><span class="global-session-chevron" aria-hidden="true">⌄</span></button>' +
      '<div id="global-session-menu" class="global-session-menu" hidden><div class="global-session-menu-head"><strong>Tus accesos</strong><span>DuckTronSur IA Academy</span></div><div class="global-session-favorites">' + cards + '</div><button class="global-session-logout" type="button">Cerrar sesión</button></div>';
    bindMenu(root);
  };
  const start = async () => {
    if (!window.supabase) await loadScript(CDN);
    if (!window.SUPABASE_URL || !window.SUPABASE_PUBLISHABLE_KEY) await loadScript('/supabase-config.js');
    if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_PUBLISHABLE_KEY) return;
    const client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY);
    window.__academySessionClient = client;
    const { data } = await client.auth.getUser();
    render(data?.user || null);
    client.auth.onAuthStateChange((_event, session) => render(session?.user || null));
  };
  start().catch(() => render(null));
})();