// ----------------  Funções específicas para página de documentos ----------------

function StartPage() {
    LoadTableOfContentsData();
}


function LoadTableOfContentsData() {
    console.log("LoadTableOfContentsData");
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        document.getElementById('leftColumn').innerHTML = leftTitle() + this.responseText;
        ExpandIndex();
        var url = getCookie("LSTURL");
        var hash = getCookie("LSTHSH");
        if (url != "" && hash != "") {
            loadDoc(url, hash)
        }
    }
    xhttp.open("GET", 'content/TocTable.html');
    xhttp.send();
}


function ExpandIndex() {
    var toggler = document.getElementsByClassName("caret");
    var expandables = document.getElementsByClassName("expandable");
    var i;
    StartPage
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




function paperFromHash(inputString) {
    var positionOfDoc = inputString.indexOf('/Doc');
    return inputString.substring(positionOfDoc + 4, positionOfDoc + 7);
}

