(() => {
  'use strict';
  const cfg = window.CATALOGO_CONFIG || {};
  const loja = cfg.loja || {};
  const get = (id) => document.getElementById(id);
  const text = (value, fallback = '') => typeof value === 'string' && value.trim() ? value.trim() : fallback;
  const validUrl = (raw) => {
    if (!raw || typeof raw !== 'string') return '';
    try { const u = new URL(raw.trim(), window.location.href); return ['http:', 'https:'].includes(u.protocol) ? u.href : ''; }
    catch { return ''; }
  };
  const imageUrl = (raw) => validUrl(raw);
  const make = (tag, cls, content) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (content !== undefined) el.textContent = content;
    return el;
  };
  const searchItems = [];

  function setupExternalLink(element, href, showWithoutLink = false) {
    const safe = validUrl(href);
    element.hidden = !safe && !showWithoutLink;
    if (safe) { element.href = safe; element.removeAttribute('aria-disabled'); }
    else { element.removeAttribute('href'); element.setAttribute('aria-disabled', 'true'); element.title = 'Adicione o link no arquivo config.js'; }
  }

  function setupBrandAndContacts() {
    document.title = `${text(loja.nome, 'Catálogo de Chuteiras')} | Chuteiras`;
    get('footerName').textContent = text(loja.nome, 'CATÁLOGO DE CHUTEIRAS').toUpperCase();
    const logo = get('storeLogo');
    const src = imageUrl(loja.logoUrl);
    if (src) {
      logo.onload = () => { logo.hidden = false; get('storeLogoFallback').hidden = true; };
      logo.onerror = () => { logo.hidden = true; get('storeLogoFallback').hidden = false; };
      logo.src = src;
    }
    const number = String(loja.whatsappNumero || '').replace(/\D/g, '');
    const wa = number.length >= 10 ? `https://wa.me/${number}?text=${encodeURIComponent(text(loja.mensagemWhatsapp, 'Olá! Vim pelo catálogo de chuteiras.'))}` : '';
    setupExternalLink(get('headerWhatsapp'), wa, true);
    setupExternalLink(get('floatingWhatsapp'), wa, true);
    setupExternalLink(get('headerInstagram'), loja.instagramUrl, true);
  }

  function addImage(holder, url, alt, fallback) {
    const src = imageUrl(url);
    if (!src) return;
    const img = document.createElement('img');
    img.alt = alt;
    img.loading = holder.id === 'heroBanner' ? 'eager' : 'lazy';
    if (holder.id === 'heroBanner') img.fetchPriority = 'high';
    img.decoding = 'async';
    img.onload = () => { if (fallback) fallback.hidden = true; };
    img.onerror = () => { img.remove(); if (fallback) fallback.hidden = false; };
    holder.append(img);
    img.src = src;
  }

  function setupBanner(holder, data, alt) {
    const info = data || {};
    const fallback = holder.querySelector('.visual-fallback');
    addImage(holder, info.image, alt, fallback);
    const href = validUrl(info.url);
    if (href) {
      holder.classList.add('is-link');
      holder.setAttribute('role', 'link');
      holder.setAttribute('tabindex', '0');
      holder.setAttribute('aria-label', `${alt} — abrir catálogo`);
      holder.style.cursor = 'pointer';
      const open = () => window.open(href, '_blank', 'noopener,noreferrer');
      holder.addEventListener('click', open);
      holder.addEventListener('keydown', (event) => { if (event.key === 'Enter') open(); });
    }
  }

  function placeholder() {
    const div = make('div', 'image-placeholder');
    const svg = document.createElement('img');
    svg.src = 'assets/favicon.svg'; svg.alt = ''; svg.className = 'placeholder-boot';
    div.append(svg, make('span', 'placeholder-index', 'SUA IMAGEM 1:1'));
    return div;
  }

  function squareCard(item, index) {
    const href = validUrl(item.url);
    const card = make(href ? 'a' : 'div', `square-card${href ? ' linked' : ''}`);
    card.id = `banner-quadrado-${index + 1}`;
    card.setAttribute('aria-label', text(item.titulo, `Banner ${index + 1}`));
    if (href) { card.href = href; card.target = '_blank'; card.rel = 'noopener noreferrer'; }
    const fallback = placeholder(); card.append(fallback);
    addImage(card, item.image, text(item.titulo, `Categoria ${index + 1}`), fallback);
    const foot = make('div', 'card-footer');
    foot.append(document.createTextNode(text(item.titulo, `Categoria ${index + 1}`)));
    foot.append(make('span', 'arrow', href ? '↗' : 'EM BREVE'));
    card.append(foot);
    searchItems.push({ label: text(item.titulo, `Categoria ${index + 1}`), type: 'Banner quadrado', href, id: card.id });
    return card;
  }

  function renderCarousel() {
    const target = get('squareCarousel');
    const items = (Array.isArray(cfg.carrossel) ? cfg.carrossel : []).slice(0, 12);
    items.forEach((item, i) => target.append(squareCard(item || {}, i)));
    const pages = Math.max(1, Math.ceil(items.length / 2));
    const dots = get('carouselDots');
    const prev = get('carouselPrevious');
    const next = get('carouselNext');
    let currentPage = 0;
    function step() {
      const first = target.firstElementChild;
      if (!first) return 0;
      const cardWidth = first.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(target).columnGap) || 0;
      return 2 * (cardWidth + gap);
    }
    function setPage(page, move = true) {
      currentPage = Math.max(0, Math.min(pages - 1, page));
      if (move) target.scrollTo({ left: currentPage * step(), behavior: 'smooth' });
      [...dots.children].forEach((dot, i) => {
        dot.classList.toggle('active', i === currentPage);
        dot.setAttribute('aria-current', i === currentPage ? 'true' : 'false');
      });
      prev.disabled = currentPage === 0;
      next.disabled = currentPage === pages - 1;
      get('carouselCounter').textContent = `${String(currentPage * 2 + 1).padStart(2, '0')}–${String(Math.min(currentPage * 2 + 2, items.length)).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    }
    for (let i = 0; i < pages; i++) {
      const dot = make('button', 'carousel-dot');
      dot.type = 'button'; dot.setAttribute('aria-label', `Ir para a página ${i + 1} do carrossel`);
      dot.addEventListener('click', () => setPage(i)); dots.append(dot);
    }
    prev.addEventListener('click', () => setPage(currentPage - 1));
    next.addEventListener('click', () => setPage(currentPage + 1));
    target.addEventListener('scroll', () => {
      const s = step(); if (!s) return;
      const actual = Math.max(0, Math.min(pages - 1, Math.round(target.scrollLeft / s)));
      if (actual !== currentPage) setPage(actual, false);
    }, { passive: true });
    target.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); setPage(currentPage + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); setPage(currentPage - 1); }
    });
    window.addEventListener('resize', () => setPage(currentPage, false));
    setPage(0, false);
  }

  function circleCard(item, sectionNumber, index) {
    const href = validUrl(item.url);
    const card = make(href ? 'a' : 'div', `round-card${href ? ' linked' : ''}`);
    card.id = `secao-${sectionNumber}-categoria-${index + 1}`;
    if (href) { card.href = href; card.target = '_blank'; card.rel = 'noopener noreferrer'; }
    const thumb = make('div', 'round-thumb');
    const fallback = make('span', 'round-fallback', '⚽');
    thumb.append(fallback);
    addImage(thumb, item.image, text(item.titulo, 'Categoria de chuteiras'), fallback);
    card.append(thumb, make('span', 'round-name', text(item.titulo, `Modelo ${index + 1}`)));
    searchItems.push({ label: text(item.titulo, `Modelo ${index + 1}`), type: `Coleção ${sectionNumber}`, href, id: card.id });
    return card;
  }

  function renderCollections() {
    const root = get('collectionSections');
    (Array.isArray(cfg.secoes) ? cfg.secoes : []).slice(0, 4).forEach((section, ix) => {
      const count = ix + 1;
      const container = make('section', 'content-section collection-section');
      container.id = `colecao-${count}`;
      const banner = make('div', 'visual-banner collection-banner placeholder-banner');
      const fallback = make('div', 'visual-fallback');
      fallback.append(make('span', 'eyebrow', `BANNER DA COLEÇÃO ${String(count).padStart(2, '0')}`), make('strong', '', 'CHUTEIRAS'), make('small', '', '1774 × 887 px'));
      banner.append(fallback);
      setupBanner(banner, section.banner, `Banner da ${text(section.titulo, `coleção ${count}`)}`);
      const heading = make('div', 'collection-title');
      heading.append(make('h2', '', text(section.titulo, `COLEÇÃO ${count}`)));
      heading.append(make('p', '', text(section.subtitulo, 'Escolha seu modelo favorito')));
      const grid = make('div', 'round-grid');
      (Array.isArray(section.colecoes) ? section.colecoes : []).slice(0, 3).forEach((entry, i) => grid.append(circleCard(entry || {}, count, i)));
      container.append(banner, heading, grid);
      root.append(container);
      searchItems.push({ label: text(section.titulo, `Coleção ${count}`), type: 'Seção', href: '', id: container.id });
    });
  }

  function setupMenuAndSearch() {
    const overlay = get('uiOverlay'), menu = get('sideMenu'), search = get('searchPanel');
    const menuBtn = get('menuOpen'), searchBtn = get('searchOpen');
    let focusedBefore = null;
    function closePanels() {
      const hadPanel = menu.classList.contains('open') || search.classList.contains('open');
      menu.classList.remove('open'); search.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true'); search.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false'); searchBtn.setAttribute('aria-expanded', 'false');
      overlay.hidden = true; document.body.style.overflow = '';
      if (hadPanel && focusedBefore?.focus) focusedBefore.focus();
    }
    function openPanel(panel) {
      focusedBefore = document.activeElement;
      closePanels();
      overlay.hidden = false; document.body.style.overflow = 'hidden';
      panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false');
      (panel === menu ? menuBtn : searchBtn).setAttribute('aria-expanded', 'true');
      (panel === menu ? get('menuClose') : get('searchInput')).focus();
    }
    menuBtn.addEventListener('click', () => openPanel(menu));
    searchBtn.addEventListener('click', () => { openPanel(search); renderSearch(''); });
    get('menuClose').addEventListener('click', closePanels);
    get('searchClose').addEventListener('click', closePanels);
    overlay.addEventListener('click', closePanels);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanels(); });

    const links = get('menuLinks');
    const nav = [{ label: 'Início', id: 'inicio' }, { label: 'Categorias e carrossel', id: 'categorias-principais' }];
    (cfg.secoes || []).slice(0, 4).forEach((sec, idx) => nav.push({ label: text(sec.titulo, `Coleção ${idx + 1}`), id: `colecao-${idx + 1}` }));
    nav.forEach(info => {
      const link = make('a', '', info.label); link.href = `#${info.id}`;
      link.addEventListener('click', closePanels); links.append(link);
    });

    const input = get('searchInput');
    input.addEventListener('input', () => renderSearch(input.value));
    function renderSearch(query) {
      const results = get('searchResults'); results.replaceChildren();
      const val = query.toLocaleLowerCase('pt-BR').trim();
      if (!val) { results.append(make('div', 'search-none', 'Digite um nome para encontrar rapidamente uma categoria ou coleção.')); return; }
      const found = searchItems.filter(item => item.label.toLocaleLowerCase('pt-BR').includes(val));
      if (!found.length) { results.append(make('div', 'search-none', 'Nenhuma categoria encontrada. Tente outro nome.')); return; }
      found.forEach(item => {
        const a = make('a', 'search-result', item.label);
        a.href = item.href || `#${item.id}`;
        if (item.href) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        a.append(make('small', '', item.type + (item.href ? ' · Abrir catálogo ↗' : ' · Ver na página')));
        a.addEventListener('click', () => { if (!item.href) closePanels(); });
        results.append(a);
      });
    }
  }

  setupBrandAndContacts();
  setupBanner(get('heroBanner'), cfg.topo?.bannerPrincipal, 'Banner principal');
  setupBanner(get('categoriesBanner'), cfg.topo?.bannerCategorias, 'Banner horizontal de categorias');
  renderCarousel();
  renderCollections();
  setupMenuAndSearch();
})();
