
function ExpandIndex()
{
    console.log("ExpandIndex");
    var toggler = document.getElementsByClassName("caret"); 
    var expandables = document.getElementsByClassName("expandable"); 
    var i; 
    console.log("toggler" + toggler.length);
    console.log("expandables" + expandables.length);
    
    for (i = 0; i < expandables.length; i++) { 
        expandables[i].parentElement.querySelector(".nested").classList.toggle("active"); 
        expandables[i].classList.toggle("caret-down"); 
    } 

    for (i = 0; i < toggler.length; i++) { 
    toggler[i].addEventListener("click", function() { 
        console.log("click function");
        this.parentElement.querySelector(".nested").classList.toggle("active"); 
        this.classList.toggle("caret-down"); 
    }); 
    } 
}


function StartPage() {
    console.log("Start page");
    LoadColumnLeft("index");
}

function LoadColumnLeft(typeData) {
    console.log("LoadColumnLeft " + "  typeData: " + typeData);
    loadDoc('leftColumn', 'content/TocTable.html')
}

function loadDoc(divID, url) {
    console.log("loadDoc " + divID + "  url: " + url);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      document.getElementById(divID).innerHTML = this.responseText;
      console.log("Toc Loaded");
      ExpandIndex();
    }
    xhttp.open("GET", url);
    xhttp.send();
  }
  