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


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function StartPage() {
    LoadColumnLeft("index");
}

function LoadColumnLeft(typeData) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        document.getElementById('leftColumn').innerHTML = this.responseText;
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



var urlCompare= "Button clicked!";

function paperFromHash(inputString) {
    var positionOfDoc = inputString.indexOf('/Doc');
    return inputString.substring(positionOfDoc + 4, positionOfDoc + 7);
}

function loadCompare() {
   var url= "Compare/Compare" + paperFromHash(urlCompare) + ".html";
   loadDoc(url, '');
}

function loadDoc(url, hash) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        document.getElementById('rightColumn').innerHTML = this.responseText;
        if (hash) {
            location.hash = "#" + hash;
        }
    }
    urlCompare= url;
    setCookie("LSTURL", url, 180)
    setCookie("LSTHSH", hash, 180)
    xhttp.open("GET", url);
    xhttp.send();
}