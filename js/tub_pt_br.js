// Common functions for the PT Alternative project

// ── Cookie helpers ──────────────────────────────────────────────────────────

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value};expires=${expires};path=/`;
}

function getCookie(name) {
    const prefix = name + '=';
    for (const part of decodeURIComponent(document.cookie).split(';')) {
        const c = part.trimStart();
        if (c.startsWith(prefix)) return c.slice(prefix.length);
    }
    return '';
}

// ── URL / anchor helpers ────────────────────────────────────────────────────

function getAnchor(url) {
    try {
        return new URL(url).hash.slice(1);
    } catch {
        return null;
    }
}

function hasAnchor() {
    return window.location.href.includes('#');
}

function findAnchorByName(anchorName) {
    return document.querySelectorAll(`a[name="${anchorName}"]`);
}

// Returns a plain object built from the query string.
// Falls back to window.location.search when no argument is supplied.
function getQueryStringParams(queryString) {
    const search = queryString || window.location.search;
    const params = {};
    new URLSearchParams(search).forEach((value, key) => { params[key] = value; });
    return params;
}

// ── Navigation ──────────────────────────────────────────────────────────────

// Called by index.html onload – redirects to the last visited page.
function LoadStartPage() {
    const page = getCookie('PAGE');
    if (page) open_page(page);
}

// Open a named page and remember the choice.
function open_page(page_name) {
    setCookie('PAGE', page_name, 180);
    window.location.href = page_name + '.html';
}

// ── Reference URL generation ────────────────────────────────────────────────

function generate_url(paper, section, paragraph) {
    const { protocol, hostname, pathname } = window.location;
    if (!Number.isInteger(paper) || !Number.isInteger(section) || !Number.isInteger(paragraph)) {
        return `${protocol}//${hostname}${pathname}`;
    }
    setCookie('paper', paper, 180);
    setCookie('section', section, 180);
    setCookie('paragraph', paragraph, 180);
    const hash = `p${String(paper).padStart(3, '0')}_${String(section).padStart(3, '0')}_${String(paragraph).padStart(3, '0')}`;
    return `${protocol}//${hostname}${pathname}#${hash}`;
}

// Opens the paragraph source on GitHub and updates the browser history entry.
function generateUrlAndOpen(codeString) {
    const parts = codeString.split(/[, .:;-]/).map(Number);

    if (!parts.every(n => Number.isInteger(n) && n >= 0 && n <= 196)) {
        console.error('Invalid code string:', codeString);
        return;
    }

    const [paper, section, paragraph] = parts;
    const padded = parts.map(n => String(n).padStart(3, '0'));

    setCookie('paper', paper, 180);
    setCookie('section', section, 180);
    setCookie('paragraph', paragraph, 180);
    addTocEntry(paper, section, paragraph);

    const urlGithub = `https://github.com/Rogreis/PtAlternative/blob/correcoes/Doc${padded[0]}/Par_${padded.join('_')}.md`;
    window.open(urlGithub, '_blank');

    const { protocol, hostname, pathname } = window.location;
    const newUrl = `${protocol}//${hostname}${pathname}?paper=${paper}&section=${section}&paragraph=${paragraph}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
}

// ── TOC entry (combo-track bridge) ─────────────────────────────────────────

function addTocEntry(paper, section, paragraph) {
    const newEntry = `${paper}:${section}-${paragraph}`;
    addNewEntryOption(newEntry);
}

// ── Reference string parser ─────────────────────────────────────────────────

// Parses a string such as "12:3-4" or "12_3_4" into { paper, section, paragraph }.
function referenceFromString(href) {
    const entry = { paper: 0, section: 0, paragraph: 1 };
    try {
        const parts = href.split(/[;:.\-_ ]/).filter(p => p.trim() !== '');
        if (parts.length >= 1) entry.paper     = parseInt(parts[0], 10);
        if (parts.length >= 2) entry.section   = parseInt(parts[1], 10);
        if (parts.length >= 3) entry.paragraph = parseInt(parts[2], 10);
    } catch (error) {
        console.error('Error parsing reference string:', error);
    }
    return entry;
}

// ── DOM helpers ─────────────────────────────────────────────────────────────

function findImmediateParentDiv(element) {
    let parent = element?.parentNode;
    while (parent) {
        if (parent.tagName?.toLowerCase() === 'div') return parent;
        parent = parent.parentNode;
    }
    return null;
}

function getCookieChoice(name, allowedValues, fallbackValue) {
    const value = getCookie(name);
    return allowedValues.includes(value) ? value : fallbackValue;
}

function applyUiTheme(theme, persist = true) {
    const normalized = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', normalized);
    if (persist) setCookie('UI_THEME', normalized, 365);
    syncThemeButton(normalized);
    return normalized;
}

function applyParagraphPalette(theme, persist = true) {
    const normalized = theme === 'neutral' ? 'neutral' : 'original';
    document.documentElement.setAttribute('data-par-theme', normalized);
    if (persist) setCookie('PAR_THEME', normalized, 365);
    syncColorsButton(normalized);
    return normalized;
}

function toggleUiTheme() {
    const current = document.documentElement.getAttribute('data-bs-theme') === 'light' ? 'light' : 'dark';
    applyUiTheme(current === 'dark' ? 'light' : 'dark');
}

function toggleParagraphPalette() {
    const current = document.documentElement.getAttribute('data-par-theme') === 'neutral' ? 'neutral' : 'original';
    applyParagraphPalette(current === 'original' ? 'neutral' : 'original');
}

function applyStoredAppearancePreferences() {
    applyUiTheme(getCookieChoice('UI_THEME', ['light', 'dark'], 'dark'), false);
    applyParagraphPalette(getCookieChoice('PAR_THEME', ['original', 'neutral'], 'neutral'), false);
}

function syncThemeButton(theme) {
    const button = document.getElementById('navThemeButton');
    if (!button) return;
    if (theme === 'dark') {
        button.title = 'Modo claro';
        button.setAttribute('aria-label', 'Modo claro');
        button.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M6.76 4.84L5.35 3.43 3.93 4.85 5.34 6.26 6.76 4.84zm10.48 0l1.42-1.41 1.41 1.42-1.41 1.41-1.42-1.42zM12 1a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1zm0 18a5 5 0 1 0 0-10a5 5 0 0 0 0 10zm10-7a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2h2zM3 12a1 1 0 1 1 0 2h2a1 1 0 1 1 0-2H3zm3.43 6.57l-1.42 1.42 1.41 1.41 1.42-1.41-1.41-1.42zM18.24 17.2l1.41 1.42 1.42-1.41-1.42-1.42-1.41 1.41zM12 5a7 7 0 1 1 0 14a7 7 0 0 1 0-14z"/></svg>';
    } else {
        button.title = 'Modo escuro';
        button.setAttribute('aria-label', 'Modo escuro');
        button.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 3a1 1 0 0 1 1 1v1.07a7 7 0 0 1 5.93 5.93H20a1 1 0 1 1 0 2h-1.07A7 7 0 0 1 13 18.93V20a1 1 0 1 1-2 0v-1.07A7 7 0 0 1 5.07 13H4a1 1 0 1 1 0-2h1.07A7 7 0 0 1 11 5.07V4a1 1 0 0 1 1-1zm0 4a5 5 0 1 0 0 10a5 5 0 0 0 0-10z"/></svg>';
    }
}

function syncColorsButton(theme) {
    const button = document.getElementById('navColorsButton');
    if (!button) return;
    if (theme === 'neutral') {
        button.title = 'Restaurar cores originais dos parágrafos';
    } else {
        button.title = 'Usar fundo neutro do tema atual';
    }
    button.setAttribute('aria-label', button.title);
}

// Updates the navbar title using the loaded document content.
// Preference order:
// 1) PT-BR title link at X:0-0
// 2) First <h3> inside paragraph pXXX_000_000
function updateNavbarTitleFromDocument(paper, containerId = 'rightColumn') {
    const titleElement = document.querySelector('.titulo');
    const container = document.getElementById(containerId);
    const paperNumber = Number(paper);
    if (!titleElement || !container || !Number.isInteger(paperNumber)) return;

    const paperPad = String(paperNumber).padStart(3, '0');
    const linkUrl = `https://multilanguagebook.urantia.org/Eng/Por/papers/${paperNumber}`;

    titleElement.setAttribute('href', linkUrl);
    titleElement.setAttribute('target', '_blank');
    titleElement.setAttribute('rel', 'noopener noreferrer');
    titleElement.setAttribute('title', 'Abre edição bilingue no site da Fundação');
    titleElement.setAttribute('aria-label', 'Abre edição bilingue no site da Fundação');

    const ptTitleLink = container.querySelector(`a[onclick*="${paperNumber}:0-0"]`);
    const ptTitle = ptTitleLink?.textContent?.trim();
    if (ptTitle) {
        titleElement.textContent = ptTitle;
        return;
    }

    const firstParagraphHeader = container.querySelector(`#p${paperPad}_000_000 h3`);
    const fallbackTitle = firstParagraphHeader?.textContent?.trim();
    if (fallbackTitle) {
        titleElement.textContent = fallbackTitle;
    }
}

// ── Shared navbar include/bootstrap ────────────────────────────────────────

async function startPageWithSharedNav(pageName, startPageFnName, printHandlerName = '', showColors = true) {
    applyStoredAppearancePreferences();
    await loadSharedNavbar();
    configureSharedNavbar(pageName, printHandlerName, showColors);
    if (typeof initComboTrack === 'function') initComboTrack();

    const startFn = window[startPageFnName];
    if (typeof startFn === 'function') {
        await Promise.resolve(startFn());
    }
}

async function loadSharedNavbar() {
    const root = document.getElementById('shared-nav-root');
    if (!root) return;
    const response = await fetch('partials/navbar.html');
    if (!response.ok) {
        throw new Error(`Failed to load shared navbar: HTTP ${response.status}`);
    }
    root.innerHTML = await response.text();
}

function configureSharedNavbar(pageName, printHandlerName, showColors) {
    const links = document.querySelectorAll('[data-page-link]');
    links.forEach(link => {
        const active = link.getAttribute('data-page-link') === pageName;
        link.classList.toggle('navactive', active);
        link.classList.toggle('active', active);
        link.classList.toggle('navinactive', !active);
    });

    const printButton = document.getElementById('navPrintButton');
    if (printButton) {
        const handler = resolveGlobalFunction(printHandlerName);
        if (typeof handler === 'function') {
            printButton.classList.remove('d-none');
            printButton.onclick = () => handler.call(window);
        } else {
            printButton.classList.add('d-none');
            printButton.onclick = null;
        }
    }

    const themeButton = document.getElementById('navThemeButton');
    if (themeButton) {
        themeButton.onclick = toggleUiTheme;
        syncThemeButton(document.documentElement.getAttribute('data-bs-theme') || 'dark');
    }

    const colorsButton = document.getElementById('navColorsButton');
    if (colorsButton) {
        const visible = !(showColors === false || showColors === 'false');
        colorsButton.classList.toggle('d-none', !visible);
        colorsButton.onclick = toggleParagraphPalette;
        syncColorsButton(document.documentElement.getAttribute('data-par-theme') || 'neutral');
    }

    initStudyLinksMenu();
}

function resolveGlobalFunction(path) {
    if (!path || typeof path !== 'string') return null;
    return path.split('.').reduce((obj, key) => obj?.[key], window) || null;
}

let studyLinksCache = null;

async function loadStudyLinks() {
    if (Array.isArray(studyLinksCache)) return studyLinksCache;
    const response = await fetch('urantia_study_links.json');
    if (!response.ok) throw new Error(`Failed to load links JSON: HTTP ${response.status}`);
    const data = await response.json();
    studyLinksCache = Array.isArray(data) ? data : [];
    return studyLinksCache;
}

function createLinksMenuItem(entry) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'dropdown-item';
    a.href = entry.url || '#';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = entry.title || entry.url || 'Link';
    if (entry.description) {
        a.title = entry.description;
        a.setAttribute('aria-label', entry.description);
    }
    li.appendChild(a);
    return li;
}

function normalizeCategory(category) {
    const value = (category || '').trim();
    return value || 'Outros Links';
}

async function initStudyLinksMenu() {
    const menu = document.getElementById('studyLinksMenu');
    const navItem = document.getElementById('studyLinksNavItem');
    if (!menu || menu.getAttribute('data-ready') === 'true') return;

    try {
        const links = await loadStudyLinks();
        const grouped = new Map();

        for (const entry of links) {
            if (!entry || !entry.url) continue;
            const category = normalizeCategory(entry.category);
            if (!grouped.has(category)) grouped.set(category, []);
            grouped.get(category).push(entry);
        }

        menu.innerHTML = '';
        grouped.forEach((entries, category) => {
            if (entries.length > 1) {
                const parentLi = document.createElement('li');
                parentLi.className = 'dropend links-submenu';

                const parentBtn = document.createElement('a');
                parentBtn.className = 'dropdown-item dropdown-toggle';
                parentBtn.href = '#';
                parentBtn.textContent = category;
                parentBtn.setAttribute('role', 'button');
                parentBtn.setAttribute('aria-expanded', 'false');

                const subMenu = document.createElement('ul');
                subMenu.className = 'dropdown-menu links-submenu-menu';

                entries.forEach(entry => {
                    subMenu.appendChild(createLinksMenuItem(entry));
                });

                parentBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    menu.querySelectorAll('.links-submenu').forEach(item => {
                        if (item !== parentLi) item.classList.remove('show');
                    });
                    menu.querySelectorAll('.links-submenu > .dropdown-menu').forEach(item => {
                        if (item !== subMenu) item.classList.remove('show');
                    });
                    menu.querySelectorAll('.links-submenu > .dropdown-toggle').forEach(item => {
                        if (item !== parentBtn) item.setAttribute('aria-expanded', 'false');
                    });

                    const isOpen = parentLi.classList.toggle('show');
                    subMenu.classList.toggle('show', isOpen);
                    parentBtn.setAttribute('aria-expanded', String(isOpen));
                });

                parentLi.appendChild(parentBtn);
                parentLi.appendChild(subMenu);
                menu.appendChild(parentLi);
            } else {
                menu.appendChild(createLinksMenuItem(entries[0]));
            }
        });

        const closeAllSubmenus = () => {
            menu.querySelectorAll('.links-submenu.show').forEach(item => item.classList.remove('show'));
            menu.querySelectorAll('.links-submenu > .dropdown-menu.show').forEach(item => item.classList.remove('show'));
            menu.querySelectorAll('.links-submenu > .dropdown-toggle[aria-expanded="true"]').forEach(item => item.setAttribute('aria-expanded', 'false'));
        };

        if (navItem) {
            navItem.addEventListener('hidden.bs.dropdown', closeAllSubmenus);
        }

        menu.setAttribute('data-ready', 'true');
    } catch (error) {
        console.error('Error loading study links menu:', error);
        menu.innerHTML = '<li><span class="dropdown-item-text">Falha ao carregar links</span></li>';
    }
}

// ── Resizable column slider ─────────────────────────────────────────────────

// Must be called after the DOM is ready (e.g. from onload or DOMContentLoaded).
function initSlider() {
    const divisor     = document.getElementById('divisor');
    const leftColumn  = document.getElementById('leftColumn');
    const rightColumn = document.getElementById('rightColumn');

    if (!divisor || !leftColumn || !rightColumn) return;

    let isDragging  = false;
    let startX      = 0;
    let initialLeft = 0;
    let initialRight = 0;

    divisor.addEventListener('mousedown', (e) => {
        isDragging   = true;
        startX       = e.clientX;
        initialLeft  = leftColumn.offsetWidth;
        initialRight = rightColumn.offsetWidth;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const delta      = e.clientX - startX;
        const total      = leftColumn.offsetWidth + rightColumn.offsetWidth + divisor.offsetWidth;
        const newLeftPct = ((initialLeft + delta) / total) * 100;

        if (newLeftPct >= 5 && newLeftPct <= 95) {
            leftColumn.style.width  = `${newLeftPct}%`;
            rightColumn.style.width = `${100 - newLeftPct - (divisor.offsetWidth / total * 100)}%`;
            divisor.setAttribute('aria-valuenow', newLeftPct);
        }
    });

    window.addEventListener('mouseup', () => { isDragging = false; });
}
