async function StartPage() 
{
  article= getArticleValue(''); // Get the article value from the query string
  if (article === undefined) 
  { 
    var last_article = getCookie("ARTICLE");
    if (typeof last_article === 'string' && last_article.trim() !== '') {
        loadArticle(last_article)
    }
    else{
        loadArticle("README")
    }
  }
  else
  {
    loadArticle(article)
  }
  initSlider();

  mermaid.initialize({ startOnLoad: true, theme: 'dark' });

}


function getArticleValue(queryString) {
  const params = getQueryStringParams(queryString);
  return params.article;
}

function initializeTreeview()
{
  var toggler = document.getElementsByClassName("caret");
  var i;

  for (i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener("click", function () {
          this.parentElement.querySelector(".nested").classList.toggle("active");
          this.classList.toggle("active");
      });
  }


  //document.addEventListener('DOMContentLoaded', function () {
      const carets = document.querySelectorAll('.treeview .caret');
      carets.forEach(caret => {
          const nested = caret.parentElement.querySelector('.nested');
          if (nested) {
              nested.classList.add('active'); // Show the nested list
              caret.classList.add('active'); // Update the caret icon
          }
      });
  //});

}

function loadArticle(article)
{
  if (typeof name !== 'string') {
    return;
  }

  console.log("Loading article: ", article);

  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    try {
        if (this.status >= 200 && this.status < 300) {
            var artigo = document.getElementById('divartigo');
            if (artigo === null) {
                console.error("Artigo não encontrado no documento HTML.");
                return;
            }
            artigo.innerHTML = this.responseText;
            document.getElementById('divartigo').innerHTML = this.responseText;
            try {
              mermaid.run(); // Esta é a chamada chave!
            } catch (e) {
              console.error("Erro ao renderizar diagramas Mermaid:", e);
            }
            loadArticleIndex(article)

        } else {
            document.getElementById('divartigo').innerHTML = "<p>Erro ao carregar o conteúdo. Código de status: " + this.status + "</p>";
        }
    } catch (error) {
        console.error("An error occurred:", error);
        document.getElementById('divartigo').innerHTML = "<p>Erro ao processar a resposta.</p>";
    }
  } 
  setCookie("ARTICLE", article, 180)
  if (!article.toLowerCase().endsWith(".html")) {
    article += ".html";
  }  
  url= `articles/${article}`;
  xhttp.open("GET", url);
  xhttp.send();
}



function loadArticleIndex(article)
{
  if (typeof name !== 'string') {
    return;
  }

  console.log("Loading article index for: ", article);

  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    try {
        if (this.status >= 200 && this.status < 300) {
            var artigo = document.getElementById('leftColumn');
            if (artigo === null) {
                console.error("Artigo não encontrado no documento HTML.");
                return;
            }
            artigo.innerHTML = this.responseText;
            document.getElementById('leftColumn').innerHTML = this.responseText;
            setTimeout(() => {
              initializeTreeview(); // Initialize the treeview after loading the content
            }, 300);
        
        } else {
            document.getElementById('leftColumn').innerHTML = "<p>Erro ao carregar o conteúdo. Código de status: " + this.status + "</p>";
        }
    } catch (error) {
        console.error("An error occurred:", error);
        document.getElementById('leftColumn').innerHTML = "<p>Erro ao processar a resposta.</p>";
    }
  } 
  setCookie("ARTICLE", article, 180)
  if (!article.toLowerCase().endsWith(".html")) {
    article += ".html";
  }  
  const article_index = article.replace(/\.html$/i, ".toc"); // Create article_index with .toc extension
  url= `articles/${article_index}`;
  console.log("Loading article index from: ", url);
  xhttp.open("GET", url);
  xhttp.send();
}


async function showParagraph(paper, section, paragraph) {
  url= generate_url(paper, section, paragraph)
  const protocol = window.location.protocol;
  const currentDomain = window.location.hostname;

  setCookie("paper", paper, 180)
  setCookie("section", section, 180)
  setCookie("paragraph", paragraph, 180)
  addTocEntry(paper, section, paragraph);
  hash = `p${paper.toString().padStart(3, '0')}_${section.toString().padStart(3, '0')}_${paragraph.toString().padStart(3, '0')}_R`;
  const fullUrl = `${protocol}//${currentDomain}/content/Doc${paper.toString().padStart(3, '0')}.html`;

  try {
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      htmlText = await response.text();
      htmlText = htmlText.replace(/id="p/g, 'id="modal');
      document.getElementById('divParagrafo').innerHTML = htmlText;
      const modal = new bootstrap.Modal(document.getElementById('modalText'));
      modal.show();
      setTimeout(() => {
        hash = `modal${paper.toString().padStart(3, '0')}_${section.toString().padStart(3, '0')}_${paragraph.toString().padStart(3, '0')}_R`;
        const divToCenter = document.getElementById(hash);
        if (divToCenter) {
          divToCenter.style.border = '1px solid gold';
          divToCenter.scrollIntoView({ block: 'center' });
        }
      }, 300); // timeout
    } catch (error) {
    console.error("An error occurred while loading the paragraph:", error);
    document.getElementById('divParagrafo').innerHTML = "<p>Erro ao carregar o conteúdo.</p>";
  }
}

function showParagraphFromComboEntry(referenceString)
{
    entry= referenceFromString(referenceString);
    showParagraph(entry.paper, entry.section, entry.paragraph);
}

function jumpToAnchor(anchorId) {
  console.log(`Jumping to anchor: ${anchorId}`);
  const anchorElement = document.getElementById(anchorId);
  if (anchorElement) {
    console.log(`Jumping to anchor: ${anchorId}`);
    anchorElement.scrollIntoView({
      behavior: 'smooth', // Smooth scrolling
      block: 'start' // Align the anchor to the top of the viewport
    });
    anchorElement.style.border = '2px solid gold'; // Optional: Highlight the anchor
    setTimeout(() => {
      anchorElement.style.border = ''; // Remove the highlight after a short delay
    }, 2000);
  } else {
    console.error(`Anchor with ID "${anchorId}" not found.`);
  }
}
