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
}

function getArticleValue(queryString) {
  const params = getQueryStringParams(queryString);
  return params.article; // Access the 'article' property
}

function loadArticle(article)
{
  if (typeof name !== 'string') {
    return;
  }

  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {

    if (this.status >= 200 && this.status < 300) { // Check for successful status codes (200-299)
      document.getElementById('divartigo').innerHTML = this.responseText;
    } else {
      document.getElementById('divartigo').innerHTML = "<p>Erro ao carregar o conteúdo. Código de status: " + this.status + "</p>"; // Display an error message to the user
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


function showParagraph(paper, section, paragraph) {
  const currentDomain = window.location.hostname;
  const protocol = window.location.protocol;

  setCookie("paper", paper, 180)
  setCookie("section", section, 180)
  setCookie("paragraph", paragraph, 180)
  partialUrl = "indexToc.html"; 
  hash = `p${paper.toString().padStart(3, '0')}_${section.toString().padStart(3, '0')}_${paragraph.toString().padStart(3, '0')}`;
  const fullUrl = `${protocol}//${currentDomain}/${partialUrl}#${hash}`;
  console.log('Full reference url: ' + fullUrl);
  window.open(fullUrl, '_blank');
}
