(() => {
  const prompts = window.PROMPTECA_PROMPTS || [];
  const $ = (selector) => document.querySelector(selector);
  const levels = [
    { value: "START", label: "START · Iniciación", color: "#f6ca37" },
    { value: "INTERMEDIO", label: "INTERMEDIO", color: "#38c5ff" },
    { value: "AVANZADO", label: "AVANZADO", color: "#ff922e" },
    { value: "PROFESIONAL", label: "PROFESIONAL", color: "#ad70ff" }
  ];
  const state = { query: "", level: "", category: "", web: false, file: false, example: false, favorites: false };
  const favoriteKey = "ducktronsur-prompteca-favorites";
  const getFavorites = () => new Set(JSON.parse(localStorage.getItem(favoriteKey) || "[]"));
  let favorites = getFavorites();
  const levelColor = (prompt) => {
    const color = prompt.levelColor.toLowerCase();
    if (color.includes("violeta")) return "#ad70ff";
    if (color.includes("naranja")) return "#ff922e";
    if (color.includes("azul")) return "#38c5ff";
    return "#f6ca37";
  };
  const isMultiLevel = (prompt, level) => prompt.level.toUpperCase().includes(level);
  const escapeHtml = (value = "") => value.replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
  const card = (prompt, featured = false) => {
    const color = levelColor(prompt);
    const fav = favorites.has(prompt.id);
    const info = featured ? "" : `<div class="prompt-meta"><span>${escapeHtml(prompt.compatibility.split(",")[0])}</span>${prompt.needsWeb === "Sí" ? "<span>Web</span>" : ""}${prompt.needsFile === "Sí" ? "<span>Archivo</span>" : ""}</div><p class="prompt-preview">${escapeHtml(prompt.prompt)}</p>`;
    return `<article class="${featured ? "featured-card" : "prompt-card"}" style="--level:${color}">
      <div class="card-top"><span class="level-pill">${escapeHtml(prompt.level)}</span><button class="favorite" type="button" data-favorite="${prompt.id}" aria-pressed="${fav}" aria-label="${fav ? "Quitar de favoritos" : "Añadir a favoritos"}">★</button></div>
      ${featured ? "" : `<span class="category-label">${escapeHtml(prompt.category)}</span>`}
      <h3>${escapeHtml(prompt.title)}</h3><p>${escapeHtml(prompt.description)}</p>${info}
      <div class="card-actions"><button class="copy-button" type="button" data-copy="${prompt.id}">Copiar prompt</button><button class="detail-button" type="button" data-detail="${prompt.id}">Ver ficha</button></div>
    </article>`;
  };
  const matches = (prompt) => {
    const searchable = [prompt.title, prompt.category, prompt.description, prompt.prompt, prompt.compatibility].join(" ").toLocaleLowerCase("es");
    return (!state.query || searchable.includes(state.query)) &&
      (!state.level || isMultiLevel(prompt, state.level)) &&
      (!state.category || prompt.category === state.category) &&
      (!state.web || prompt.needsWeb === "Sí") &&
      (!state.file || prompt.needsFile === "Sí") &&
      (!state.example || Boolean(prompt.example)) &&
      (!state.favorites || favorites.has(prompt.id));
  };
  const render = () => {
    const visible = prompts.filter(matches).sort((a,b) => Number(a.order) - Number(b.order));
    $("#prompt-grid").innerHTML = visible.map(item => card(item)).join("");
    $("#empty-state").hidden = visible.length > 0;
    $("#results-summary").textContent = `${visible.length} de ${prompts.length} fichas`;
    $("#prompt-count").textContent = prompts.length;
    const labels = [state.query && `“${state.query}”`, state.level, state.category, state.web && "Web", state.file && "Archivo", state.example && "Con ejemplo", state.favorites && "Favoritos"].filter(Boolean);
    $("#active-filters").innerHTML = labels.map(label => `<span>${escapeHtml(label)}</span>`).join("");
  };
  const copy = async (id) => {
    const prompt = prompts.find(item => item.id === id);
    if (!prompt) return;
    try { await navigator.clipboard.writeText(prompt.prompt); }
    catch {
      const text = document.createElement("textarea"); text.value = prompt.prompt; document.body.appendChild(text); text.select(); document.execCommand("copy"); text.remove();
    }
    const toast = $("#toast"); toast.textContent = "¡Prompt copiado!"; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 1800);
  };
  const openDetail = (id) => {
    const prompt = prompts.find(item => item.id === id);
    if (!prompt) return;
    const relatedIds = prompt.related.split(",").map(value => Number(value.trim()));
    const related = prompts.filter(item => relatedIds.includes(Number(item.id.replace("P","")))).slice(0, 3);
    $("#dialog-content").innerHTML = `<div class="dialog-body" style="--level:${levelColor(prompt)}">
      <span class="level-pill">${escapeHtml(prompt.level)}</span><h2 id="dialog-title">${escapeHtml(prompt.title)}</h2><p class="dialog-description">${escapeHtml(prompt.description)}</p>
      <div class="dialog-meta"><span>${escapeHtml(prompt.category)}</span><span>${escapeHtml(prompt.compatibility)}</span><span>${prompt.needsWeb === "Sí" ? "Necesita web" : "Sin web"}</span><span>${prompt.needsFile === "Sí" ? "Necesita archivo" : "Sin archivo"}</span></div>
      <section class="dialog-section"><h3>PROMPT</h3><pre class="prompt-code">${escapeHtml(prompt.prompt)}</pre><div class="dialog-actions"><button class="copy-button" type="button" data-copy="${prompt.id}">Copiar prompt</button><button class="favorite" type="button" data-favorite="${prompt.id}" aria-pressed="${favorites.has(prompt.id)}" aria-label="Favorito">★</button></div></section>
      <section class="dialog-section"><h3>QUÉ PERSONALIZAR</h3><p>${escapeHtml(prompt.customize)}</p></section>
      <section class="dialog-section"><h3>EJEMPLO</h3><p>${escapeHtml(prompt.example)}</p></section>
      <section class="dialog-section"><h3>REVISIÓN HUMANA</h3><p>${escapeHtml(prompt.humanReview)}. <span class="status-note">${escapeHtml(prompt.notes)}</span></p></section>
      ${related.length ? `<section class="dialog-section"><h3>RELACIONADOS</h3><div class="related-list">${related.map(item => `<button class="related-button" type="button" data-detail="${item.id}">${escapeHtml(item.title)}</button>`).join("")}</div></section>` : ""}
    </div>`;
    $("#prompt-dialog").showModal();
  };
  const toggleFavorite = (id) => {
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    localStorage.setItem(favoriteKey, JSON.stringify([...favorites]));
    render();
    const dialog = $("#prompt-dialog");
    if (dialog.open) openDetail(id);
  };
  const reset = () => {
    Object.assign(state, { query: "", level: "", category: "", web: false, file: false, example: false, favorites: false });
    $("#prompt-search").value = ""; $("#category-filter").value = "";
    ["filter-web","filter-file","filter-example","filter-favorites"].forEach(id => { $("#"+id).checked = false; });
    document.querySelectorAll("[data-level]").forEach(button => button.setAttribute("aria-pressed","false"));
    render();
  };
  const init = () => {
    const categories = [...new Set(prompts.map(item => item.category))].sort((a,b) => a.localeCompare(b,"es"));
    $("#category-filter").insertAdjacentHTML("beforeend", categories.map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join(""));
    $("#level-filters").innerHTML = levels.map(level => `<button class="level-filter" style="--level:${level.color}" type="button" data-level="${level.value}" aria-pressed="false">${level.label}</button>`).join("");
    $("#featured-grid").innerHTML = prompts.filter(item => item.featured === "Sí").sort((a,b) => Number(a.order) - Number(b.order)).map(item => card(item,true)).join("");
    $("#prompt-search").addEventListener("input", event => { state.query = event.target.value.trim().toLocaleLowerCase("es"); render(); });
    $("#prompt-search").addEventListener("keydown", event => { if (event.key === "Escape") { event.target.value = ""; state.query = ""; render(); event.target.blur(); } });
    $("#category-filter").addEventListener("change", event => { state.category = event.target.value; render(); });
    document.querySelectorAll("[data-level]").forEach(button => button.addEventListener("click", () => { state.level = state.level === button.dataset.level ? "" : button.dataset.level; document.querySelectorAll("[data-level]").forEach(item => item.setAttribute("aria-pressed", String(item.dataset.level === state.level))); render(); }));
    [["filter-web","web"],["filter-file","file"],["filter-example","example"],["filter-favorites","favorites"]].forEach(([id,key]) => $("#"+id).addEventListener("change", event => { state[key] = event.target.checked; render(); }));
    $("#clear-filters").addEventListener("click", reset); $("#empty-reset").addEventListener("click", reset);
    document.addEventListener("click", event => { const favorite = event.target.closest("[data-favorite]"); const copyButton = event.target.closest("[data-copy]"); const detail = event.target.closest("[data-detail]"); if (favorite) toggleFavorite(favorite.dataset.favorite); if (copyButton) copy(copyButton.dataset.copy); if (detail) openDetail(detail.dataset.detail); });
    $("#dialog-close").addEventListener("click", () => $("#prompt-dialog").close());
    $("#prompt-dialog").addEventListener("click", event => { if (event.target === $("#prompt-dialog")) $("#prompt-dialog").close(); });
    render();
  };
  init();
})();
