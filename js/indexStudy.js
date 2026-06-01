// ── Funções específicas para a página de artigos (indexStudy.html) ────────────

async function StartPage() {
    const article = getArticleValue();
    if (article === undefined) {
        const last = getCookie('ARTICLE');
        await loadArticle(last?.trim() ? last : 'README');
    } else {
        await loadArticle(article);
    }
    initSlider();
    mermaid.initialize({ startOnLoad: true, theme: 'dark' });
}

function getArticleValue() {
    return getQueryStringParams().article;
}

function initializeTreeview() {
    for (const toggler of document.getElementsByClassName('caret')) {
        toggler.addEventListener('click', function () {
            this.parentElement.querySelector('.nested').classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    for (const caret of document.querySelectorAll('.treeview .caret')) {
        const nested = caret.parentElement.querySelector('.nested');
        if (nested) {
            nested.classList.add('active');
            caret.classList.add('active');
        }
    }
}

async function loadArticle(article) {
    setCookie('ARTICLE', article, 180);
    if (!article.toLowerCase().endsWith('.html')) article += '.html';

    const url = new URL(`articles/${article}`, window.location.href).href;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const html = await response.text();
        const divArtigo = document.getElementById('divartigo');
        if (!divArtigo) { console.error('divartigo not found'); return; }
        divArtigo.innerHTML = html;
        window.scrollTo({ top: 0, behavior: 'auto' });
        try { mermaid.run(); } catch (e) { console.error('Mermaid error:', e); }

        await loadArticleIndex(article);
    } catch (err) {
        console.error('Failed to load article:', article, err);
        if (article.toLowerCase() !== 'readme.html') {
            await loadArticle('README.html');
        } else {
            document.getElementById('divartigo').innerHTML = '<p>Erro ao carregar o conteúdo.</p>';
        }
    }
}

async function loadArticleIndex(article) {
    if (typeof article !== 'string') return;

    setCookie('ARTICLE', article, 180);
    if (!article.toLowerCase().endsWith('.html')) article += '.html';
    const tocFile = article.replace(/\.html$/i, '.toc');
    const url = `articles/${tocFile}`;

    try {
        const response = await fetch(url);
        const leftColumn = document.getElementById('leftColumn');
        if (!leftColumn) return;
        if (!response.ok) {
            leftColumn.innerHTML = `<p>Erro ao carregar o índice. Código: ${response.status}</p>`;
            return;
        }
        leftColumn.innerHTML = await response.text();
        initializeTreeview();
    } catch (error) {
        console.error('Error loading article index:', error);
        const leftColumn = document.getElementById('leftColumn');
        if (leftColumn) leftColumn.innerHTML = '<p>Erro ao processar a resposta.</p>';
    }
}

async function showParagraph(paper, section, paragraph) {
    setCookie('paper',     paper,     180);
    setCookie('section',   section,   180);
    setCookie('paragraph', paragraph, 180);
    addTocEntry(paper, section, paragraph);

    const pad   = n => String(n).padStart(3, '0');
    const docUrl = `${window.location.protocol}//${window.location.hostname}/content/Doc${pad(paper)}.html`;

    try {
        const response = await fetch(docUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        let html = await response.text();
        html = html.replace(/id="p/g, 'id="modal');
        document.getElementById('divParagrafo').innerHTML = html;

        const modal = new bootstrap.Modal(document.getElementById('modalText'));
        modal.show();

        setTimeout(() => {
            const baseModalHash = `modal${pad(paper)}_${pad(section)}_${pad(paragraph)}`;
            const target = document.getElementById(baseModalHash) || document.getElementById(`${baseModalHash}_R`);
            if (target) {
                target.style.border = '1px solid gold';
                target.scrollIntoView({ block: 'center' });
            }
        }, 300);
    } catch (error) {
        console.error('Error loading paragraph:', error);
        document.getElementById('divParagrafo').innerHTML = '<p>Erro ao carregar o conteúdo.</p>';
    }
}

function showParagraphFromComboEntry(referenceString) {
    const entry = referenceFromString(referenceString);
    showParagraph(entry.paper, entry.section, entry.paragraph);
}

function jumpToAnchor(anchorId) {
    const el = document.getElementById(anchorId);
    if (!el) { console.error(`Anchor "${anchorId}" not found.`); return; }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.style.border = '2px solid gold';
    setTimeout(() => { el.style.border = ''; }, 2000);
}

function ImprimeArtigo() {
    const conteudo = document.getElementById('divartigo');
    if (!conteudo) { alert('Conteúdo do artigo não encontrado.'); return; }

    const janela = window.open('', '', 'width=900,height=700');
    const data   = new Date().toLocaleDateString();
    janela.document.write(`
        <html><head>
        <style>
            @media print {
                * { color: #000 !important; background: #fff !important; box-shadow: none !important; text-shadow: none !important; }
                .badge, .bg-primary, .navactive, .navinactive, .btn, .modal-header, .modal-footer, .table th, .table td
                    { background: #fff !important; color: #000 !important; border-color: #000 !important; }
                footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 12px; padding: 8px 0; }
            }
        </style>
        </head><body>
        ${conteudo.innerHTML}
        <footer>Impresso em: ${data}</footer>
        </body></html>`);
    janela.document.close();
    janela.focus();
    janela.print();
}

