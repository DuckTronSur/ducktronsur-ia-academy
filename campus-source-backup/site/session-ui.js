(() => {
  const CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.1/dist/umd/supabase.min.js';
  const loadScript = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  const displayName = user => user.user_metadata?.display_name || user.email?.split('@')[0] || 'Usuario';
  const initials = user => displayName(user).split(/[\s._-]+/).filter(Boolean).slice(0,2).map(part => part[0]).join('').toUpperCase() || 'U';
  const sessionHost = () => document.querySelector('.academy-links,.nav-links,.campus-nav-links,.nav-tools,.campus-nav,.auth-top') || document.body;
  const tidyNavigation = root => {
    document.querySelectorAll('.academy-access,.nav-access').forEach(element => {
      if (!root.contains(element)) element.hidden = true;
    });
    document.querySelectorAll('.academy-links a[href="/mi-campus.html"],.nav-links a[href="/mi-campus.html"]').forEach(element => {
      if (!root.contains(element)) element.hidden = true;
    });
  };
  const render = user => {
    let root = document.querySelector('#global-session-ui');
    const host = sessionHost();
    if (!root) {
      root = document.createElement('aside');
      root.id = 'global-session-ui';
      root.className = 'global-session-ui';
    }
    if (!host.contains(root)) {
      host.classList.add('global-session-host');
      host.appendChild(root);
    }
    if (!user) { root.hidden = true; return; }
    tidyNavigation(root);
    const name = displayName(user);
    root.hidden = false;
    root.innerHTML = '<span class="global-session-avatar" aria-hidden="true">' + escapeHtml(initials(user)) + '</span>' +
      '<span class="global-session-copy"><strong>' + escapeHtml(name) + '</strong><small>Sesión iniciada</small></span>' +
      '<a class="global-session-link" href="/mi-campus.html">Mi Campus</a>' +
      '<button class="global-session-logout" type="button">Cerrar sesión</button>';
    root.querySelector('.global-session-logout').addEventListener('click', async event => {
      const button = event.currentTarget;
      button.disabled = true;
      button.textContent = 'Cerrando…';
      const { error } = await window.__academySessionClient.auth.signOut({ scope: 'local' });
      if (error) { button.disabled = false; button.textContent = 'Reintentar'; return; }
      location.href = '/auth.html';
    });
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