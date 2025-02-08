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
  initComboTrack();

}

function getArticleValue(queryString) {
  const params = getQueryStringParams(queryString);
  return params.article; // Access the 'article' property
}

function loadArticle(article)
{
  console.log("Loading article: " + article);
  if (typeof name !== 'string') {
    return;
  }

  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    try {
        console.log("Chegou");
        if (this.status >= 200 && this.status < 300) { // Check for successful status codes (200-299)
            console.log("Status ok");
            var artigo = document.getElementById('divartigo');
            console.log("artigo: " + artigo);
            if (artigo === null) {
                console.log("Artigo não encontrado");
                return;
            }
            console.log("Vai preencher: " + this.responseText);
            artigo.innerHTML = this.responseText;
            document.getElementById('divartigo').innerHTML = this.responseText;
        } else {
            console.log("Not OK");
            document.getElementById('divartigo').innerHTML = "<p>Erro ao carregar o conteúdo. Código de status: " + this.status + "</p>"; // Display an error message to the user
        }
    } catch (error) {
        console.error("An error occurred:", error);
        document.getElementById('divartigo').innerHTML = "<p>Erro ao processar a resposta.</p>"; // Display a generic error message to the user
    }
  } 
  setCookie("ARTICLE", article, 180)
  if (!article.toLowerCase().endsWith(".html")) {
    article += ".html";
  }  
  url= `articles/${article}`;
  console.log("Vai buscar " + url);
  xhttp.open("GET", url);
  xhttp.send();
}

function showParagraph(paper, section, paragraph) {
  url= generate_url(paper, section, paragraph)
  const protocol = window.location.protocol;
  const currentDomain = window.location.hostname;
  const currentPage = "indexToc.html";

  setCookie("paper", paper, 180)
  setCookie("section", section, 180)
  setCookie("paragraph", paragraph, 180)
  addTocEntry(paper, section, paragraph);
  hash = `p${paper.toString().padStart(3, '0')}_${section.toString().padStart(3, '0')}_${paragraph.toString().padStart(3, '0')}`;
  const fullUrl = `${protocol}//${currentDomain}/${currentPage}#${hash}`;
  window.open(fullUrl, '_blank');
}
