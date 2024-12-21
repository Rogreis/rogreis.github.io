// Common functions for the PT Alternative project

function hasAnchor() {
    const currentUrl = window.location.href;
    const hasHash = currentUrl.indexOf('#') !== -1;
    return hasHash;
  }
  
function verifyAnchor() 
{ 
  console.log("verifyAnchor");
  if (!hasAnchor())
    {
      // Load the document at the right column from cookies
      var paper = getCookie("paper");
      var section = getCookie("section");
      var paragraph = getCookie("paragraph");
      if (typeof paper !== 'string' || paper.trim() === '' ||
      typeof section !== 'string' || section.trim() === '' ||
      typeof paragraph !== 'string' || paragraph.trim() === '') 
      {
        return;
      }
    loadDocByPaperSectionParagraph(paper, section, paragraph);
  }
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


// Legacy loadDoc function
function loadDoc(url, hash)
{
  if (typeof hash !== 'string') {
    return;
  }
  const parts = hash.split('_');
  const paper = parseInt(parts[0].substring(1), 10); // Remove 'p' and parse
  const section = parseInt(parts[1], 10);
  const paragraph = parseInt(parts[2], 10);
  console.log("Legacy loadDoc: paper= " + paper + " section= " + section + " paragraph= " + paragraph);
  loadDocByPaperSectionParagraph(paper, section, paragraph) ;
}


// Load the document at the right column
function loadDocByPaperSectionParagraph(paper, section, paragraph) 
{
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        document.getElementById('rightColumn').innerHTML = this.responseText;

        // Assuming the anchor ID is within the loaded content
        //hash = `U${paper}_${section}_${paragraph}`;
        hash = `p${paper.toString().padStart(3, '0')}_${section.toString().padStart(3, '0')}_${paragraph.toString().padStart(3, '0')}`;
        console.log("hash= " + hash);
        var anchor = document.getElementById(hash);
      
        // Scroll to the anchor smoothly (optional)
        if (anchor) {
          anchor.scrollIntoView({ behavior: 'smooth' });
        } else {
          // If the anchor is not found, try direct hash navigation
          location.hash = "#" + hash;
        }
    }
    console.log("loadDocByPaperSectionParagraph: paper= " + paper + " section= " + section + " paragraph= " + paragraph);

    setCookie("paper", paper, 180)
    setCookie("section", section, 180)
    setCookie("paragraph", paragraph, 180)
  
    // const formattedPaper = `p${paper.toString().padStart(3, '0')}`;
    // const formattedSection = section.toString().padStart(3, '0');
    // const formattedParagraph = paragraph.toString().padStart(3, '0');
    //url= `content/Doc${paper.toString().padStart(3, '0')}.html#U${paper.toString()}_${section.toString()}_${paragraph.toString()}`;
    url= `content/Doc${paper.toString().padStart(3, '0')}.html`;
    // content/Doc000.html','p000_010_000'
    console.log("url= " + url);

    //setCookie("LSTURL", url, 180)
    //setCookie("LSTHSH", hash, 180)
    xhttp.open("GET", url);
    xhttp.send();
}


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
  
    // Set new hash
    const hash = `p${parts.map(part => part.toString().padStart(3, '0')).join('_')}`;
    setCookie("LSTHSH", hash, 180)

    window.open(urlGithub, '_blank');
  }
