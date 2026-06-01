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

// Updates the navbar title using the loaded document content.
// Preference order:
// 1) PT-BR title link at X:0-0
// 2) First <h3> inside paragraph pXXX_000_000
function updateNavbarTitleFromDocument(paper, containerId = 'rightColumn') {
    const titleElement = document.querySelector('.titulo');
    const container = document.getElementById(containerId);
    if (!titleElement || !container || !Number.isInteger(paper)) return;

    const paperNumber = Number(paper);
    const paperPad = String(paperNumber).padStart(3, '0');

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
            printButton.onclick = handler;
        } else {
            printButton.classList.add('d-none');
            printButton.onclick = null;
        }
    }

    const colorsButton = document.getElementById('navColorsButton');
    if (colorsButton) {
        const visible = !(showColors === false || showColors === 'false');
        colorsButton.classList.toggle('d-none', !visible);
    }
}

function resolveGlobalFunction(path) {
    if (!path || typeof path !== 'string') return null;
    return path.split('.').reduce((obj, key) => obj?.[key], window) || null;
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
