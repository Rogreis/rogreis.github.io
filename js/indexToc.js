// ----------------  Funções específicas para página de documentos ----------------

async function StartPage() {
    await LoadTableOfContentsData();
    verifyAnchor();
    setCookie("PAGE", "indexToc", 180)
}

async function loadDocFromCookie() {
    const paper = getCookie("paper");
    const section = getCookie("section");
    const paragraph = getCookie("paragraph");
    if (typeof paper !== 'string' || paper.trim() === '' ||
      typeof section !== 'string' || section.trim() === '' ||
      typeof paragraph !== 'string' || paragraph.trim() === '') {
      return;
    }
    await loadDocByPaperSectionParagraph(paper, section, paragraph);
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
      console.log("verifyAnchor anchor: " + anchor);
      console.log("verifyAnchor paper: " + paper);
      console.log("verifyAnchor section: " + section);
      console.log("verifyAnchor paragraph: " + paragraph);
      setCookie("paper", paper, 180)
      setCookie("section", section, 180)
      setCookie("paragraph", paragraph, 180)
    }
  }

  //expandCurrentTocElement(); 
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


async function ExpandIndex() {
    var toggler = document.getElementsByClassName("caret");
    //var expandables = document.getElementsByClassName("expandable");
    var i;

    // for (i = 0; i < expandables.length; i++) {
    //     expandables[i].parentElement.querySelector(".nested").classList.toggle("active");
    //     expandables[i].classList.toggle("caret-down");
    // }

    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    }
    console.log("ExpandIndex");
    expandCurrentTocElement(); 
    await loadDocFromCookie()
  }


function toggleCaret(partElement) {
  // 1. Find the span element within partElement.
  // We use querySelector here, which finds the *first* matching element.
  // If you have multiple spans and need a specific one, you might need
  // to adjust the selector (e.g., using a class or other attribute).
  console.log("toggleCaret: " + partElement);
  const spanElement = partElement.querySelector('span'); // Or a more specific selector like 'span.my-caret'
  console.log("toggleCaret: " + spanElement);

  // Check if the span element exists before trying to toggle the class.
  if (spanElement) {
    // 2. Toggle the 'caret-down' class.
    spanElement.parentElement.querySelector(".nested").classList.toggle("active");
    spanElement.classList.toggle('caret-down');
    console.log("achou o span");
  } else {
    console.error("Span element not found within partElement.");
  }
}

// Expand the current TOC element based on the current URL or cookies
function expandCurrentTocElement() 
{
    const currentUrl = window.location.href;
    anchor= getAnchor(currentUrl)
    paper= -1;
    section= 0;
    if (anchor) {
      const parts = anchor.split('_');
      paper = parseInt(parts[0].substring(1), 10); // Remove 'p' and parse
      console.log("expandCurrentTocElement1 paper: " + paper);
    }
     else
     {
        paper = parseInt(getCookie("paper"), 10);
        console.log("expandCurrentTocElement2 paper: " + paper);
     }

     if (paper == 0) {
      const intro = document.getElementById("toc_000_000");
      toggleCaret(intro);
    }
    if (paper > 0 && paper < 32) {
      const part1 = document.getElementById("part1");
      toggleCaret(part1);
    }
    if (paper > 31 && paper < 57) {
      const part2 = document.getElementById("part2");
      toggleCaret(part2);
    }
    if (paper > 56 && paper < 120) {
      const part3 = document.getElementById("part3");
      if (!part3)
        console.log("part3 não encontrado");
      toggleCaret(part3);
    }
    if (paper > 119) {
      const part4 = document.getElementById("part4");
      toggleCaret(part4);
    }

    toc_element_id= `toc_${paper.toString().padStart(3, '0')}_${section.toString().padStart(3, '0')}`;
    console.log("expandCurrentTocElement toc_element_id: " + toc_element_id);
    const toc_element= document.getElementById(toc_element_id);
    if (toc_element)
    {
      console.log("expandCurrentTocElement achou toc_element: " + toc_element);
      toggleCaret(toc_element);
      toc_element.scrollIntoView({
        behavior: 'smooth', // Para rolagem suave (opcional)
        block: 'start' // Para alinhar o topo do elemento ao topo da tela
      });
  
    }
    else
    {
      console.log("expandCurrentTocElement toc_element não encontrado");
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
