// ----------------  Funções específicas para página de documentos ----------------

async function StartPage() {
  verifyAnchor();
  await LoadTableOfContentsData();
  setCookie("PAGE", "indexToc", 180)
  initSlider();
}

async function loadDocFromCookie() {
  try {
    let paper = parseInt(getCookie("paper"), 10);
    let section = parseInt(getCookie("section"), 10);
    let paragraph = parseInt(getCookie("paragraph"), 10);

    if (isNaN(paper) || isNaN(section) || isNaN(paragraph)) {
        paper = 0;
        section = 0;
        paragraph = 1;
        setCookie("paper", paper, 180);
        setCookie("section", section, 180);
        setCookie("paragraph", paragraph, 180);
    }

    await loadDocByPaperSectionParagraph(paper, section, paragraph);
    } catch (error) {
        console.error("An error occurred while loading document from cookies:", error);
  }
}

async function verifyAnchor() 
{ 
  if (!hasAnchor())
    {
      // Load the document at the right column from cookies
      await loadDocFromCookie(); 
  }
  else
  {
    const currentUrl = window.location.href;
    anchor= getAnchor(currentUrl)
    if (anchor) {
      const parts = anchor.split('_');
      const paper = parseInt(parts[0].substring(1), 10); // Remove 'p' and parse
      const section = parseInt(parts[1], 10);
      const paragraph = parseInt(parts[2], 10);
      setCookie("paper", paper, 180)
      setCookie("section", section, 180)
      setCookie("paragraph", paragraph, 180)
    }
  }
}

async function LoadTableOfContentsData() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      document.getElementById('leftColumn').innerHTML = this.responseText;
        setTimeout(() => {
          initializeTocTable();
        }, 300); // timeout
    }
    xhttp.open("GET", 'content/TocTable.html');
    xhttp.send();
}


async function initializeTocTable() {
    var toggler = document.getElementsByClassName("caret"); 
    var i; 
    for (i = 0; i < toggler.length; i++) { 
        toggler[i].addEventListener("click", function () { 
            this.parentElement.querySelector(".nested").classList.toggle("active"); 
            this.classList.toggle("active"); 
        }); 
    } 
    expandCurrentTocElement(); 
    await loadDocFromCookie()
  }

function toggleCaret(partElement) {
  setTimeout(() => {
    partElement.querySelector(".nested").classList.toggle("active");
    partElement.classList.toggle("active");
  }, 300);
}

// Expand the current TOC element based on the current URL or cookies
function expandCurrentTocElement() 
{
    const paper = getCookie("paper");
    const section = getCookie("section");
    const paragraph = getCookie("paragraph");
    if (typeof paper !== 'string' || paper.trim() === '' ||
      typeof section !== 'string' || section.trim() === '' ||
      typeof paragraph !== 'string' || paragraph.trim() === '') {
      return;
    }

    if (paper == 0) {
      const intro = document.getElementById("toc_000_000_div");
      toggleCaret(intro);
    }
    if (paper > 0 && paper < 32) {
      const part1 = document.getElementById("part1_div");
      if (part1)
      {
        toggleCaret(part1);
      }
    }
    if (paper > 31 && paper < 57) {
      const part2 = document.getElementById("part2_div");
      if (part2)
      {
        toggleCaret(part2);
      }
    }
    if (paper > 56 && paper < 120) {
      const part3 = document.getElementById("part3_div");
      if (part3)
      {
        toggleCaret(part3);
      }
    }
    if (paper > 119) {
      const part4 = document.getElementById("part4_div");
      if (part4)
        {
          toggleCaret(part4);
        }
      toggleCaret(part4);
    }

    toc_element_id= `toc_${paper.toString().padStart(3, '0')}_000`;
    toc_element= document.getElementById(toc_element_id);
    if (toc_element)
    {
      setTimeout(() => {
        toggleCaret(toc_element);
        toc_element_div_id= `${toc_element_id}_div`;
        toc_element= document.getElementById(toc_element_div_id);
        if (toc_element)
        {
          toc_element.scrollIntoView({
            behavior: 'smooth', // Para rolagem suave (opcional)
            block: 'start' // Para alinhar o topo do elemento ao topo da tela
          });
        }
      }, 300); // Adjust the timeout as needed
    }
}


// Load the document at the right column
async function loadDocByPaperSectionParagraph(paper, section, paragraph) 
{
  if (!Number.isInteger(paper) || !Number.isInteger(section) || !Number.isInteger(paragraph)) {
    console.error("Invalid input: paper, section, and paragraph must be integers.");
    paper= 0;
    section= 0;
    paragraph= 1;
  }

  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
      document.getElementById('rightColumn').innerHTML = this.responseText;
      hash = `p${paper.toString().padStart(3, '0')}_${section.toString().padStart(3, '0')}_${paragraph.toString().padStart(3, '0')}`;

      // Check if the anchor is present before setting the hash
      setTimeout(() => {
        var divelement = document.getElementById(hash);
        if (divelement)
        {
          divelement.scrollIntoView({ block: 'start' });
        }
      }, 300); // Adjust the timeout as needed
  }
  setCookie("paper", paper, 180)
  setCookie("section", section, 180)
  setCookie("paragraph", paragraph, 180)
  url= `content/Doc${paper.toString().padStart(3, '0')}.html`;
  xhttp.open("GET", url);
  xhttp.send();
}

function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
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
  if (isMobile()) {
    const currentUrl = 'https://rogreis.github.io/indexToc.html';
    window.location.href= currentUrl;
  } 
  loadDocByPaperSectionParagraph(paper, section, paragraph) ;
  addTocEntry(paper, section, paragraph);
}

async function showParagraph(paper, section, paragraph) {
  await loadDocByPaperSectionParagraph(paper, section, paragraph);
}

function showParagraphFromComboEntry(referenceString)
{
    entry= referenceFromString(referenceString);
    loadDocByPaperSectionParagraph(entry.paper, entry.section, entry.paragraph, false);
}
