async function StartPage() 
{

  if (!hasAnchor())
  {
    var last_article = getCookie("ARTICLE");
    if (typeof last_article === 'string' && last_article.trim() !== '') {
        loadArticle(last_article)
    }
    else{
        loadArticle("README.html")
    }
  }
  else
  {
    const currentUrl = window.location.href;
    anchor= getAnchor(currentUrl)
    if (anchor) {
      loadArticle(anchor)
    }
  }
}

function loadArticle(name)
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

  setCookie("ARTICLE", name, 180)
  url= `articles/${name}`;
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
  const fullUrl = `${protocol}//${currentDomain}/${partialUrl}`;
  window.open(fullUrl, '_blank');
}
