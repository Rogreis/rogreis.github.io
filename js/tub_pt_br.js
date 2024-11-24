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
    LoadTableOfContenstaData("index");
}


function paperFromHash(inputString) {
    var positionOfDoc = inputString.indexOf('/Doc');
    return inputString.substring(positionOfDoc + 4, positionOfDoc + 7);
}

var urlCompare= "";
var urlCompareCopy= "";
var compareLoaded= 0;
function loadCompare() {
   if (compareLoaded === 0)
   {
    urlCompare= urlCompareCopy;
    var url= "Compare/Compare" + paperFromHash(urlCompare) + ".html";
    compareLoaded= 1;
    loadDoc(url, '');
   }
   else
   {
    loadDoc(urlCompareCopy, '');
    compareLoaded= 0;
   }
}

function loadDoc(url, hash) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        document.getElementById('rightColumn').innerHTML = this.responseText;
        if (hash) {
            location.hash = "#" + hash;
        }
    }
    urlCompareCopy= url;
    setCookie("LSTURL", url, 180)
    setCookie("LSTHSH", hash, 180)
    xhttp.open("GET", url);
    xhttp.send();
}
