// ── Funções específicas para a página de documentos (indexToc.html) ──────────

async function StartPage() {
    const result = getParQueryValues();
    if (result) {
        await loadDocByPaperSectionParagraph(result.paper, result.section, result.paragraph);
    } else {
        await verifyAnchor();
    }
    await LoadTableOfContentsData();
    setCookie('PAGE', 'indexToc', 180);
    initSlider();
}

// Parses ?par=PPP_SSS_XXX from the URL.
// Returns { paper, section, paragraph } as integers when valid, otherwise null.
function getParQueryValues() {
    const par = new URLSearchParams(window.location.search).get('par');
    if (!par) return null;

    const match = par.match(/^(\d{1,3})_(\d{1,3})_(\d{1,3})$/);
    if (!match) return null;

    const paper     = parseInt(match[1], 10);
    const section   = parseInt(match[2], 10);
    const paragraph = parseInt(match[3], 10);

    if (isNaN(paper) || isNaN(section) || isNaN(paragraph)) return null;
    if (![paper, section, paragraph].every(n => n >= 0 && n <= 197)) return null;

    setCookie('paper',     paper,     180);
    setCookie('section',   section,   180);
    setCookie('paragraph', paragraph, 180);
    return { paper, section, paragraph };
}

async function loadDocFromCookie() {
    try {
        let paper     = parseInt(getCookie('paper'),     10);
        let section   = parseInt(getCookie('section'),   10);
        let paragraph = parseInt(getCookie('paragraph'), 10);

        if (isNaN(paper) || isNaN(section) || isNaN(paragraph)) {
            paper = 0; section = 0; paragraph = 1;
            setCookie('paper',     paper,     180);
            setCookie('section',   section,   180);
            setCookie('paragraph', paragraph, 180);
        }
        await loadDocByPaperSectionParagraph(paper, section, paragraph);
    } catch (error) {
        console.error('Error loading document from cookies:', error);
    }
}

async function verifyAnchor() {
    if (!hasAnchor()) {
        await loadDocFromCookie();
        return;
    }
    const anchor = getAnchor(window.location.href);
    if (anchor) {
        const parts     = anchor.split('_');
        const paper     = parseInt(parts[0].slice(1), 10);
        const section   = parseInt(parts[1], 10);
        const paragraph = parseInt(parts[2], 10);
        setCookie('paper',     paper,     180);
        setCookie('section',   section,   180);
        setCookie('paragraph', paragraph, 180);
    }
}

async function LoadTableOfContentsData() {
    try {
        const response = await fetch('content/TocTable.html');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        document.getElementById('leftColumn').innerHTML = await response.text();
        await initializeTocTable();
    } catch (error) {
        console.error('Error loading TOC:', error);
    }
}

async function initializeTocTable() {
    for (const toggler of document.getElementsByClassName('caret')) {
        toggler.addEventListener('click', function () {
            this.parentElement.querySelector('.nested').classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    expandCurrentTocElement();
    await loadDocFromCookie();
}

function toggleCaret(partElement) {
    setTimeout(() => {
        partElement.querySelector('.nested').classList.toggle('active');
        partElement.classList.toggle('active');
        partElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

// Expand the TOC tree to show the paper currently stored in cookies.
function expandCurrentTocElement() {
    const paper     = getCookie('paper');
    const section   = getCookie('section');
    const paragraph = getCookie('paragraph');

    if (!paper?.trim() || !section?.trim() || !paragraph?.trim()) return;

    const paperNum = parseInt(paper, 10);

    const partRanges = [
        { id: 'toc_000_000_div', min: 0,   max: 0   },
        { id: 'part1_div',       min: 1,   max: 31  },
        { id: 'part2_div',       min: 32,  max: 56  },
        { id: 'part3_div',       min: 57,  max: 119 },
        { id: 'part4_div',       min: 120, max: 197 },
    ];
    for (const range of partRanges) {
        if (paperNum >= range.min && paperNum <= range.max) {
            const el = document.getElementById(range.id);
            if (el) toggleCaret(el);
        }
    }

    const tocElementId = `toc_${paper.padStart(3, '0')}_000_div`;
    const tocElement   = document.getElementById(tocElementId);
    if (tocElement) {
        setTimeout(() => {
            toggleCaret(tocElement);
            const inner = document.getElementById(`${tocElementId}_div`);
            inner?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    }
}

// Load a document into the right column by coordinates.
async function loadDocByPaperSectionParagraph(paper, section, paragraph) {
    if (!Number.isInteger(paper) || !Number.isInteger(section) || !Number.isInteger(paragraph)) {
        console.error('loadDocByPaperSectionParagraph: arguments must be integers.');
        paper = 0; section = 0; paragraph = 1;
    }

    setCookie('paper',     paper,     180);
    setCookie('section',   section,   180);
    setCookie('paragraph', paragraph, 180);

    const url = `content/Doc${String(paper).padStart(3, '0')}.html`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        document.getElementById('rightColumn').innerHTML = await response.text();
        updateNavbarTitleFromDocument(paper, 'rightColumn');

        const baseHash = `p${String(paper).padStart(3, '0')}_${String(section).padStart(3, '0')}_${String(paragraph).padStart(3, '0')}`;
        setTimeout(() => {
            const target = document.getElementById(baseHash) || document.getElementById(`${baseHash}_R`);
            target?.scrollIntoView({ block: 'start' });
        }, 300);
    } catch (error) {
        console.error('Error loading document:', error);
    }
}

function isMobile() {
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent);
}

// Legacy entry point called from links inside content HTML files.
function loadDoc(url, hash) {
    if (typeof hash !== 'string') return;
    const parts     = hash.split('_');
    const paper     = parseInt(parts[0].slice(1), 10);
    const section   = parseInt(parts[1], 10);
    const paragraph = parseInt(parts[2], 10);
    if (isMobile()) {
        window.location.href = `${window.location.protocol}//${window.location.host}/indexToc.html`;
        return;
    }
    loadDocByPaperSectionParagraph(paper, section, paragraph);
    addTocEntry(paper, section, paragraph);
}

async function showParagraph(paper, section, paragraph) {
    await loadDocByPaperSectionParagraph(paper, section, paragraph);
}

function showParagraphFromComboEntry(referenceString) {
    const entry = referenceFromString(referenceString);
    loadDocByPaperSectionParagraph(entry.paper, entry.section, entry.paragraph);
}
