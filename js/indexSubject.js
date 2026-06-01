// ── Funções específicas para a página de assuntos (indexSubject.html) ────────

class Item {
    constructor(title, details) {
        this.Title   = title;
        this.Details = details.map(d => new Detail(d.DetailType, d.Text, d.Links));
    }
}

class Detail {
    constructor(detailType, text, links) {
        this.DetailType = detailType;
        this.Text       = text;
        this.Links      = links;
    }
}

let SubjectItems = [];

function StartPage() {
    loadAndUnzipJSON('subject.zip', SubjectPageCallback);
    verifyAnchor();
    initSlider();
}

function verifyAnchor() {
    if (hasAnchor()) return;
    const paper     = getCookie('paper');
    const section   = getCookie('section');
    const paragraph = getCookie('paragraph');
    if (!paper?.trim() || !section?.trim() || !paragraph?.trim()) return;
    loadDocByPaperSectionParagraph(parseInt(paper, 10), parseInt(section, 10), parseInt(paragraph, 10), true);
}

function get_subject_cookies() {
    const subject_titles = getCookie('subject_titles');
    if (typeof subject_titles === 'string' && subject_titles.trim().length >= 3) {
        document.getElementById('searchInputBox').value = subject_titles;
        findTitlesContainingSubstring(subject_titles);
    } else {
        return;
    }
    const subject_selectedTitle = getCookie('subject_selectedTitle');
    if (subject_selectedTitle?.trim()) showSubjectDetails(subject_selectedTitle);
}

function SubjectPageCallback(error, data) {
    if (error) {
        console.error('Error loading JSON:', error.message);
        return;
    }
    SubjectItems = data.map(item => new Item(item.Title, item.Details));
    get_subject_cookies();
}

// Uses JSZip (loaded as a script dependency) to fetch and parse a zipped JSON file.
function loadAndUnzipJSON(url, callback) {
    const xhr        = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = async function () {
        if (xhr.status !== 200) {
            callback(new Error(`Failed to load file: ${xhr.statusText}`), null);
            return;
        }
        try {
            const zip        = new JSZip();
            const zipContent = await zip.loadAsync(xhr.response);
            const fileName   = Object.keys(zipContent.files)[0];
            const json       = await zip.file(fileName).async('string');
            callback(null, JSON.parse(json));
        } catch (error) {
            callback(error, null);
        }
    };
    xhr.onerror = () => callback(new Error('XMLHttpRequest error'), null);
    xhr.send();
}

function findTitlesContainingSubstring(searchString) {
    if (searchString.length < 3) return;
    setCookie('subject_titles', searchString, 180);

    const lower   = searchString.toLowerCase();
    const listBox = document.getElementById('listBoxAssuntos');
    listBox.innerHTML = '';

    SubjectItems
        .filter(item => item.Title.toLowerCase().includes(lower))
        .forEach(item => {
            const option  = document.createElement('option');
            option.text   = item.Title;
            listBox.add(option);
        });
}

// Builds a document fragment with clickable reference links.
// Uses event listeners instead of javascript: hrefs.
function buildLinksFragment(links) {
    const linkRegex = /^(\d{1,3}):(\d{1,3})\.(\d{1,3})$/;
    const fragment  = document.createDocumentFragment();

    if (!Array.isArray(links)) {
        console.error('Expected links to be an array, got:', typeof links);
        return fragment;
    }

    links.forEach(rawLink => {
        const link  = rawLink.trim();
        const match = link.match(linkRegex);
        if (!match) { console.warn(`Invalid link format: "${link}"`); return; }

        const [, PPP, SSS, XXX] = match;
        const paper     = parseInt(PPP, 10);
        const section   = parseInt(SSS, 10);
        const paragraph = parseInt(XXX, 10);

        const a       = document.createElement('a');
        a.href        = '#';
        a.className   = 'amadon_link';
        a.textContent = `${PPP}:${SSS}.${XXX}`;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            loadDocByPaperSectionParagraph(paper, section, paragraph, true);
        });
        fragment.appendChild(a);
        fragment.appendChild(document.createTextNode(' '));
    });

    return fragment;
}

function showSubjectDetails(selectedTitle) {
    const selectedItem = SubjectItems.find(item => item.Title === selectedTitle);
    if (!selectedItem) { console.error('Item not found:', selectedTitle); return; }
    setCookie('subject_selectedTitle', selectedTitle, 180);

    const detailsList = document.getElementById('detailsList');
    detailsList.innerHTML = '';

    const heading = document.createElement('h3');
    heading.style.color = 'gold';
    heading.textContent = selectedTitle;
    detailsList.appendChild(heading);

    selectedItem.Details.forEach(detail => {
        const block = document.createElement('blockquote');
        if (detail.DetailType === 2) {
            const a       = document.createElement('a');
            a.href        = '#';
            a.className   = 'amadon_link';
            a.textContent = 'See also: ' + detail.Links[0];
            a.addEventListener('click', (e) => { e.preventDefault(); showSubjectDetails(detail.Links[0]); });
            block.appendChild(a);
        } else {
            block.innerHTML = `${detail.Text}<br>`;
            block.appendChild(buildLinksFragment(detail.Links));
        }
        detailsList.appendChild(block);
    });
}

// Legacy entry point – called from dynamically generated links in older content.
function loadDoc(url, hash) {
    if (typeof hash !== 'string') return;
    const parts     = hash.split('_');
    const paper     = parseInt(parts[0].slice(1), 10);
    const section   = parseInt(parts[1], 10);
    const paragraph = parseInt(parts[2], 10);
    loadDocByPaperSectionParagraph(paper, section, paragraph, true);
}

// Load a document into the right column by coordinates.
async function loadDocByPaperSectionParagraph(paper, section, paragraph, isToAddTocEntry) {
    setCookie('paper',     paper,     180);
    setCookie('section',   section,   180);
    setCookie('paragraph', paragraph, 180);
    if (isToAddTocEntry) addTocEntry(paper, section, paragraph);

    const url = `content/Doc${String(paper).padStart(3, '0')}.html`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        document.getElementById('rightColumn').innerHTML = await response.text();
        updateNavbarTitleFromDocument(paper, 'rightColumn');

        const baseHash = `p${String(paper).padStart(3, '0')}_${String(section).padStart(3, '0')}_${String(paragraph).padStart(3, '0')}`;
        const anchor = document.getElementById(baseHash) || document.getElementById(`${baseHash}_R`);
        if (anchor) {
            anchor.scrollIntoView({ block: 'start' });
        } else {
            location.hash = '#' + baseHash;
        }
    } catch (error) {
        console.error('Error loading document:', error);
    }
}

async function showParagraphFromDataEntry(paper, section, paragraph) {
    await loadDocByPaperSectionParagraph(paper, section, paragraph, false);
}

function showParagraphFromComboEntry(referenceString) {
    const entry = referenceFromString(referenceString);
    loadDocByPaperSectionParagraph(entry.paper, entry.section, entry.paragraph, false);
}

// ── DOM event wiring ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.getElementById('searchInputBox');
    const listBox  = document.getElementById('listBoxAssuntos');

    if (inputBox) {
        inputBox.addEventListener('input', (event) => {
            const value = event.target.value;
            if (value.length >= 3) {
                findTitlesContainingSubstring(value);
            } else {
                document.getElementById('listBoxAssuntos').innerHTML = '';
            }
        });
        inputBox.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                findTitlesContainingSubstring(event.target.value);
            }
        });
    }

    if (listBox) {
        listBox.addEventListener('change', (event) => {
            const selectedText = event.target.options[event.target.selectedIndex].text;
            showSubjectDetails(selectedText);
        });
    }
});