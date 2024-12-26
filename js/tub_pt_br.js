// Common functions for the PT Alternative project

// Get the anchor from the URL
function getAnchor(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hash.substring(1); // Remove o # inicial
  } catch (error) {
    return null;
  }
}

// Verify if we have an anchor in the current URL
function hasAnchor() {
    const currentUrl = window.location.href;
    const hasHash = currentUrl.indexOf('#') !== -1;
    console.log('hasAnchor: ' + hasHash);
    return hasHash;
  }
  
// Work with the first initial data loaded
function LoadStartPage() {
  var page_name = getCookie("PAGE");
  if (page_name) {
    open_page(page_name)
  }
}

// Open a page from top menu
function open_page(page_name)
{
  window.location.href = page_name + ".html";
  setCookie("PAGE", page_name, 180)
}



// Open a github page enabling the edition of the paragraph
function generateUrlAndOpen(codeString) {
  const separatorRegex = /[, .:;-]/;
  const parts = codeString.split(separatorRegex).map(Number);

  if (!parts.every(part => Number.isInteger(part) && part >= 0 && part <= 196)) {
    console.error('Invalid code string:', codeString);
    return;
  }

  // Format integers to 3 digits
  const formattedParts = parts.map(part => part.toString().padStart(3, '0'));
  const urlGithub = `https://github.com/Rogreis/PtAlternative/blob/correcoes/Doc${formattedParts[0]}/Par_${formattedParts.join('_')}.md`;

  const paper = parseInt(parts[0]);
  const section = parseInt(parts[1], 10);
  const paragraph = parseInt(parts[2], 10);
  setCookie("paper", paper, 180)
  setCookie("section", section, 180)
  setCookie("paragraph", paragraph, 180)
    
  window.open(urlGithub, '_blank');
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
