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
    return hasHash;Do
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
  const urlGithub = `https://github.com/Rogreis/PtAlternative/blob/correcoes/Doc${formattedParts[0]}/Par_${formattedParts.join('_')}.md`;

  const paper = parseInt(parts[0]);
  const section = parseInt(parts[1], 10);
  const paragraph = parseInt(parts[2], 10);
  setCookie("paper", paper, 180)
  setCookie("section", section, 180)
  setCookie("paragraph", paragraph, 180)
  addTocEntry(paper, section, paragraph);
  // url= generate_url(paper, section, paragraph)
  // window.location.href = url;
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



function initComboTrack() 
{
  combobox = document.getElementById('comboTrack');

  combobox.addEventListener('click', () => {
    const inputValue = combobox.value.trim();
    if (inputValue !== "") {
        addTocEntryFromString(inputValue);
        combobox.value = ""; // Clear the input field
    }
  });
}

function parsePaperSectionParagraph(inputString) {
  if (typeof inputString !== 'string') {
    return { error: "Input must be a string." };
  }

  // Regular expression to split the string by any of the allowed separators
  const parts = inputString.split(/[:\s\-\;.]+/);

  if (parts.length !== 3) {
    return { error: "Input must contain three values separated by ':', ' ', '-', ';' or '.'." };
  }

  const paper = parseInt(parts[0], 10);
  const section = parseInt(parts[1], 10);
  const paragraph = parseInt(parts[2], 10);

  if (isNaN(paper) || isNaN(section) || isNaN(paragraph)) {
    return { error: "All values must be integers." };
  }

  if (paper < 0 || paper > 196) {
    return { error: "Paper value must be between 0 and 196." };
  }

  return { paper, section, paragraph };
}

// // Test cases
// console.log(parsePaperSectionParagraph("10:5-2")); // { paper: 10, section: 5, paragraph: 2 }
// console.log(parsePaperSectionParagraph("10 5;2")); // { paper: 10, section: 5, paragraph: 2 }
// console.log(parsePaperSectionParagraph("10.5.2")); // { paper: 10, section: 5, paragraph: 2 }
// console.log(parsePaperSectionParagraph("10-5 2")); // { paper: 10, section: 5, paragraph: 2 }
// console.log(parsePaperSectionParagraph("10;5.2")); // { paper: 10, section: 5, paragraph: 2 }
// console.log(parsePaperSectionParagraph("200:5:2")); // { error: "Paper value must be between 0 and 196." }
// console.log(parsePaperSectionParagraph("10:a:2")); // { error: "All values must be integers." }
// console.log(parsePaperSectionParagraph("10:5"));    // { error: "Input must contain three values separated by ':', ' ', '-', ';' or '.'." }
// console.log(parsePaperSectionParagraph(123));     // { error: "Input must be a string." }
// console.log(parsePaperSectionParagraph("10:5:2:4")); // { error: "Input must contain three values separated by ':', ' ', '-', ';' or '.'." }

function addTocEntryFromString(inputValue) 
{
  var result= parsePaperSectionParagraph(inputValue);
  addTocEntry(result.paper, result.section, result.paragraph);
}


function saveCollectionToCookie() {
  const collection = document.getElementById('myCollection').children;
  const dataToSave = [];

  for (let i = 0; i < collection.length; i++) {
      let dataValue = collection[i].getAttribute("data-value");
      if(dataValue){
          dataToSave.push(dataValue);
      }
  }

  const cookieValue = JSON.stringify(dataToSave); // Convert to JSON string
  document.cookie = "myCollectionData=" + cookieValue + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/"; // Set cookie
  alert("Collection saved to cookie!");
}

function rebuildCollectionFromCookie() {
  const cookieName = "myCollectionData=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  let cookieValue = null;
  for(let i = 0; i < cookieArray.length; i++) {
    let c = cookieArray[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(cookieName) == 0) {
      cookieValue = c.substring(cookieName.length, c.length);
      break;
    }
  }

  if (cookieValue) {
    try {
      const dataFromCookie = JSON.parse(cookieValue); // Parse JSON string
      const collectionDiv = document.getElementById('myCollection');
      collectionDiv.innerHTML = ''; // Clear existing content

      for (let i = 0; i < dataFromCookie.length; i++) {
        const newItem = document.createElement('div');
        newItem.className = "item";
        newItem.setAttribute("data-value", dataFromCookie[i]);
        newItem.textContent = dataFromCookie[i].charAt(0).toUpperCase() + dataFromCookie[i].slice(1); // Capitalize first letter
        collectionDiv.appendChild(newItem);
      }
        alert("Collection rebuilded from cookie!");
    } catch (error) {
      console.error("Error parsing cookie data:", error);
        alert("Error rebuilding collection from cookie!");
    }
  } else {
    alert("No collection data found in cookie!");
  }
}

// Add an item to the combo track
function addTocEntry(paper, section, paragraph) {
    let datalist = document.getElementById('suggestions');
    let options = datalist.querySelectorAll('option');
    let values = Array.from(options).map(o => o.value);
    entry = `${paper}:${section}-${paragraph}`;

    if (!values.includes(entry)) {
        let newOption = document.createElement('option');
        newOption.value = entry;
        datalist.appendChild(newOption);

        if (datalist.children.length > MAX_ITEMS) {
            datalist.removeChild(datalist.firstChild); // Remove the oldest item
        }
        console.log('addTocEntry:', datalist.children);
    }
}

