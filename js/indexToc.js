// ----------------  Funções específicas para página de documentos ----------------

function StartPage() {
    LoadTableOfContentsData();
    verifyAnchor();
}


function LoadTableOfContentsData() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        document.getElementById('leftColumn').innerHTML = this.responseText;
        ExpandIndex();
    }
    xhttp.open("GET", 'content/TocTable.html');
    xhttp.send();
}


function ExpandIndex() {
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

function paperFromHash(inputString) {
    var positionOfDoc = inputString.indexOf('/Doc');
    return inputString.substring(positionOfDoc + 4, positionOfDoc + 7);
}

