// ----------------  Funções específicas para página de documentos ----------------

async function StartPage() {
    await LoadTableOfContentsData();
    verifyAnchor();
    setCookie("PAGE", "indexToc", 180)
}

async function verifyAnchor() 
{ 
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
    await loadDocByPaperSectionParagraph(paper, section, paragraph);
  }
  else
  {
    const currentUrl = window.location.href;
    anchor= getAnchor(currentUrl)
    if (anchor) {
      scrollToUrlAnchor(anchor) 
    }
  }
}

async function LoadTableOfContentsData() {
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
    console.log("ExpandIndex");
    scrollToCookieAnchor();
  }

function paperFromHash(inputString) {
    var positionOfDoc = inputString.indexOf('/Doc');
    return inputString.substring(positionOfDoc + 4, positionOfDoc + 7);
}

// Create toc element id from the given url with anchor
function scrollToUrlAnchor(urlAnchor) 
{
  const parts = urlAnchor.split('_');
  const paper = parseInt(parts[0].substring(1), 10); // Remove 'p' and parse
  const section = parseInt(parts[1], 10);
  const paragraph = parseInt(parts[2], 10);
  elementId= `toc_${paper.toString().padStart(3, '0')}_${section.toString().padStart(3, '0')}`; 
  scrollTocTable(elementId)
  loadDocByPaperSectionParagraph(paper, section, paragraph) 
}

// Get the anchor from cookies
function scrollToCookieAnchor() {
  var paper = getCookie("paper");
  var section = getCookie("section");
  if ( (typeof paper === 'string' && paper.trim() !== '') &&
       (typeof section === 'string' && section.trim() !== ''))
  {
    elementId= `toc_${paper.toString().padStart(3, '0')}_${section.toString().padStart(3, '0')}`; 
    scrollTocTable(elementId)
  }
}

// Scroll to a specific element in the table of contents
function scrollTocTable(elementId) {
  console.log("scrollTocTable elementId= " + elementId);
  const element = document.getElementById(elementId);
  if (element) {
    console.log("achou elementId");
    element.scrollIntoView({
      behavior: 'smooth', // Para rolagem suave (opcional)
      block: 'start' // Para alinhar o topo do elemento ao topo da tela
    });
  } 
}


// Load the document at the right column
async function loadDocByPaperSectionParagraph(paper, section, paragraph) 
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
    setCookie("paper", paper, 180)
    setCookie("section", section, 180)
    setCookie("paragraph", paragraph, 180)
    url= `content/Doc${paper.toString().padStart(3, '0')}.html`;
    xhttp.open("GET", url);
    xhttp.send();
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
  loadDocByPaperSectionParagraph(paper, section, paragraph) ;
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
