
function ExpandIndex()
{
    var toggler = document.getElementsByClassName("caret"); 
    var expandables = document.getElementsByClassName("expandable"); 
    var i; 
    
    for (i = 0; i < expandables.length; i++) { 
        expandables[i].parentElement.querySelector(".nested").classList.toggle("active"); 
        expandables[i].classList.toggle("caret-down"); 
    } 

    for (i = 0; i < toggler.length; i++) { 
    toggler[i].addEventListener("click", function() { 
        this.parentElement.querySelector(".nested").classList.toggle("active"); 
        this.classList.toggle("caret-down"); 
    }); 
    } 
}


function StartPage() {
    LoadColumnLeft("index");
}

function LoadColumnLeft(typeData) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      document.getElementById('leftColumn').innerHTML = this.responseText;
      ExpandIndex();
    }
    xhttp.open("GET", 'content/TocTable.html');
    xhttp.send();
}

function loadDoc(url, hash) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() 
    {
      document.getElementById('rightColumn').innerHTML = this.responseText;
      if (hash) 
      {
        location.hash = "#" + hash;
      }      
    }
    xhttp.open("GET", url);
    xhttp.send();
  }
  