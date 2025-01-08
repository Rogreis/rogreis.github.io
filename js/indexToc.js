// ----------------  Funções específicas para página de documentos ----------------

var toc_loaded= false;

async function StartPage() {
  toc_loaded= false;
  verifyAnchor();
  console.log('na Página toc');
  await LoadTableOfContentsData();
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
      setCookie("paper", paper, 180)
      setCookie("section", section, 180)
      setCookie("paragraph", paragraph, 180)
    }
  }

  //expandCurrentTocElement(); 
}

async function LoadTableOfContentsData() {
    console.log('LoadTableOfContentsData');
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        document.getElementById('leftColumn').innerHTML = this.responseText;
        setTimeout(() => {
          toc_loaded= true;
          ExpandIndex();
        }, 300); // Adjust the timeout as needed
    }
    xhttp.open("GET", 'content/TocTable.html');
    xhttp.send();
}


async function ExpandIndex() {
  console.log('ExpandIndex');
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
    expandCurrentTocElement(); 
    await loadDocFromCookie()
  }


function toggleCaret(partElement) {
  // 1. Find the span element within partElement.
  // We use querySelector here, which finds the *first* matching element.
  // If you have multiple spans and need a specific one, you might need
  // to adjust the selector (e.g., using a class or other attribute).
  const spanElement = partElement.querySelector('span'); // Or a more specific selector like 'span.my-caret'

  // Check if the span element exists before trying to toggle the class.
  if (spanElement) {
    // 2. Toggle the 'caret-down' class.
    spanElement.parentElement.querySelector(".nested").classList.toggle("active");
    spanElement.classList.toggle('caret-down');
  }
}

// Expand the current TOC element based on the current URL or cookies
function expandCurrentTocElement() 
{
  console.log('expandCurrentTocElement');

    const paper = getCookie("paper");
    const section = getCookie("section");
    const paragraph = getCookie("paragraph");
    if (typeof paper !== 'string' || paper.trim() === '' ||
      typeof section !== 'string' || section.trim() === '' ||
      typeof paragraph !== 'string' || paragraph.trim() === '') {
      return;
    }
    console.log('expandCurrentTocElement: ' + paper + ' ' + section + ' ' + paragraph);

    if (paper == 0) {
      const intro = document.getElementById("toc_000_000");
      toggleCaret(intro);
    }
    if (paper > 0 && paper < 32) {
      const part1 = document.getElementById("part1");
      if (part1)
      {
        console.log('expandCurrentTocElement: achou part1');
        toggleCaret(part1);
      }
    }
    if (paper > 31 && paper < 57) {
      const part2 = document.getElementById("part2");
      if (part2)
      {
        toggleCaret(part2);
      }
    }
    if (paper > 56 && paper < 120) {
      const part3 = document.getElementById("part3");
      if (part3)
      {
        toggleCaret(part3);
      }
    }
    if (paper > 119) {
      const part4 = document.getElementById("part4");
      if (part4)
        {
          toggleCaret(part4);
        }
      toggleCaret(part4);
    }

    toc_element_id= `toc_${paper.toString().padStart(3, '0')}_000}`;
    console.log('expandCurrentTocElement: ' + toc_element_id);  
    const toc_element= document.getElementById(toc_element_id);
    if (toc_element)
    {
      console.log('Achour o : ' + toc_element_id);  
      setTimeout(() => {
        toggleCaret(toc_element);
        toc_element.scrollIntoView({
          behavior: 'smooth', // Para rolagem suave (opcional)
          block: 'start' // Para alinhar o topo do elemento ao topo da tela
        });
      }, 300); // Adjust the timeout as needed

  
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
}
