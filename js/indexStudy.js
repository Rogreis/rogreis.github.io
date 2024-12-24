async function StartPage() {

    var last_article = getCookie("ARTICLE");
    if (typeof last_article === 'string' && last_article.trim() !== '') {
        loadArticle(last_article)
    }
    else{
        loadArticle("README.html")
    }

}

function loadArticle(name)
{
  if (typeof name !== 'string') {
    return;
  }

  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
      document.getElementById('divartigo').innerHTML = this.responseText;
  }
  console.log("loadArticle: " + name);

  setCookie("ARTICLE", name, 180)
  url= `articles/${name}`;
  console.log("url= " + url);

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
