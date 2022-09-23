
function ExpandIndex()
{
    console.log("ExpandIndex");
    var toggler = document.getElementsByClassName("caret"); 
    var expandables = document.getElementsByClassName("expandable"); 
    var i; 
    console.log("toggler      " + toggler.length);
    console.log("expandables  " + expandables.length);
    
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
    console.log("loadDoc typeData: " + typeData);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      document.getElementById('leftColumn').innerHTML = this.responseText;
      console.log("Toc Loaded");
      ExpandIndex();
    }
    xhttp.open("GET", 'content/TocTable.html');
    xhttp.send();
}

function loadDoc(url, hash) {
    console.log("loadDoc url: " + url + "  hash: " + hash);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() 
    {
      document.getElementById('rightColumn').innerHTML = this.responseText;
      if (hash) 
    {
      console.log("hash: " + hash);
      location.hash = "#" + hash;
    }      
    console.log("Doc loaded " + url);
    }
    xhttp.open("GET", url);
    xhttp.send();
  }
  
  function ChangeStatus(st)
  {
    alert(st);
  }

  function openEdit()
  {
    console.log("inside open modal 3");


    var options= {
      show: true,
      keyboard: false,
      backdrop: 'static'
    };
    console.log(options);
    modal= $('#editChildWindow');
    modal.options= options;
    modal.show();

    //$('#editChildWindow').modal("show")

  }

  