// Common functions for the PT Alternative project

// Variable for the slider
var divisor;
var colunaEsquerda;
var colunaDireita;
let isDragging = false;
let startX;
let initialLeftWidth;
let initialRightWidth;

// Variables for the comboTrack
var combobox;
var datalist;
const MAX_ITEMS = 25;


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
    return hasHash;
  }
  
// Find an anchor by name
function findAnchorByName(anchorName) {
  const anchors = document.querySelectorAll(`a[name="${anchorName}"]`);
  return anchors; // Returns a NodeList (can have zero, one, or multiple elements)
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


function generate_url(paper, section, paragraph)
{
  const protocol = window.location.protocol;
  const currentDomain = window.location.hostname;
  const currentPage = window.location.pathname;

  if (!Number.isInteger(paper) || !Number.isInteger(section) || !Number.isInteger(paragraph)) {
    const fullUrl = `${protocol}//${currentDomain}/${currentPage}`;
    return fullUrl;
  }

  setCookie("paper", paper, 180)
  setCookie("section", section, 180)
  setCookie("paragraph", paragraph, 180)
  hash = `p${paper.toString().padStart(3, '0')}_${section.toString().padStart(3, '0')}_${paragraph.toString().padStart(3, '0')}`;
  const fullUrl = `${protocol}//${currentDomain}/${currentPage}#${hash}`;
  return fullUrl;
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

  const paper = parseInt(parts[0]);
  const section = parseInt(parts[1], 10);
  const paragraph = parseInt(parts[2], 10);
  setCookie("paper", paper, 180)
  setCookie("section", section, 180)
  setCookie("paragraph", paragraph, 180)
  addTocEntry(paper, section, paragraph);
  // url= generate_url(paper, section, paragraph)
  // window.location.href = url;
  const urlGithub = `https://github.com/Rogreis/PtAlternative/blob/correcoes/Doc${formattedParts[0]}/Par_${formattedParts.join('_')}.md`;
  window.open(urlGithub, '_blank');

  const protocol = window.location.protocol;
  const currentDomain = window.location.hostname;
  const currentPage = window.location.pathname;

  // Change the current URL's query string
  const newQueryString = `?paper=${paper}&section=${section}&paragraph=${paragraph}`;
  const newUrl = `${protocol}//${currentDomain}${currentPage}${newQueryString}`;
  window.history.pushState({ path: newUrl }, '', newUrl);

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

// Get a dictionary from a query string
function getQueryStringParams(queryString) {
  // Use window.location.search if no queryString is provided
  queryString = queryString || window.location.search;

  // Remove the leading "?" if present
  if (queryString.startsWith("?")) {
    queryString = queryString.substring(1);
  }

  const params = {};

  if (!queryString) {
    return params; // Return empty object if no query string
  }

  const pairs = queryString.split("&");

  for (const pair of pairs) {
    const [name, value] = pair.split("=");

    if (name) { // Check if name exists after splitting
      try {
        // Decode URI components to handle special characters
        params[decodeURIComponent(name)] = value ? decodeURIComponent(value) : "";
      } catch (error) {
          console.error("Error decoding URI component:", error);
          params[name] = value || ""; // Fallback to raw value if decoding fails
      }
    }
  }
  return params;
}


function findImmediateParentDiv(element) {
  if (!element) {
    return null; // Handle null or undefined input
  }

  let parent = element.parentNode;

  while (parent) {
    if (parent.tagName.toLowerCase() === 'div') {
      return parent; // Found the immediate parent div
    }
    parent = parent.parentNode; // Go up the DOM tree
  }

  return null; // No parent div found
}


// Initialize the slider
// Must run after the load event
function initSlider() 
{
  divisor = document.getElementById('divisor');
  colunaEsquerda = document.getElementById('leftColumn');
  colunaDireita = document.getElementById('rightColumn');

  divisor.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    initialLeftWidth = colunaEsquerda.offsetWidth;
    initialRightWidth = colunaDireita.offsetWidth;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const newLeftWidth = initialLeftWidth + deltaX;
    const newRightWidth = initialRightWidth - deltaX;
    const totalWidth = colunaEsquerda.offsetWidth + colunaDireita.offsetWidth + divisor.offsetWidth;
    const newLeftPercentage = (newLeftWidth / totalWidth) * 100;
  
    if (newLeftPercentage >= 5 && newLeftPercentage <= 95) {
      colunaEsquerda.style.width = `${newLeftPercentage}%`;
      colunaDireita.style.width = `${100 - newLeftPercentage - (divisor.offsetWidth/totalWidth*100)}%`;
      divisor.setAttribute("aria-valuenow", newLeftPercentage);
    }
  });
  
  window.addEventListener('mouseup', () => {
    isDragging = false;
  });
}


// Add an item to the combo track
function addTocEntry(paper, section, paragraph) {
    newEntry = `${paper}:${section}-${paragraph}`;
    addNewEntryOption(newEntry)
}


function referenceFromString(href) {
  const entry = { paper: 0, section: 0, paragraph: 1 };
  try {
      const sep = /[;:.\-_ ]/;
      const parts = href.split(sep).filter(part => part.trim() !== '');

      switch (parts.length) {
          case 0:
              break;
          case 1:
              entry.paper = parseInt(parts[0], 10);
              entry.section = 0;
              entry.paragraph = 1;
              break;
          case 2:
              entry.paper = parseInt(parts[0], 10);
              entry.section = parseInt(parts[1], 10);
              entry.paragraph = 1;
              break;
          default:
              entry.paper = parseInt(parts[0], 10);
              entry.section = parseInt(parts[1], 10);
              entry.paragraph = parseInt(parts[2], 10);
              break;
      }
  } catch (error) {
      console.error("An error occurred while parsing href:", error);
      // In case of exception, the entry is returned with what it already has
  }
  return entry;
}
