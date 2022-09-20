
function ExpandIndex()
{
    console.log("ExpandIndex");
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
    console.log("Start page");
    LoadColumnLeft("index");
    //$("#leftColumn").load("content/index.txt");    
}

function LoadColumnLeft(typeData) {
    console.log("LoadColumnLeft " + "  typeData: " + typeData);
    loadDoc('leftColumn', 'content/TocTable.html')
    ExpandIndex();
}

function loadDoc(divID, url) {
    console.log("loadDoc " + divID + "  url: " + url);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      document.getElementById(divID).innerHTML = this.responseText;
    }
    xhttp.open("GET", url);
    xhttp.send();
  }
  