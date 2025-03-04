const trackComboInput = document.getElementById('mytrackCombo');
const trackComboOptions = document.getElementById('mytrackComboOptions');
// Load the collection from the cookie
let options = [];
rebuildCollectionFromCookie(); 
updateOptionsDisplay();
trackComboOptions.style.display = 'none';



function saveCollectionToCookie() {
  const cookieValue = JSON.stringify(options); // Convert to JSON string
  setCookie("suggestionsData", cookieValue, 180)
}


function rebuildCollectionFromCookie() {
const cookieName = "suggestionsData";
const cookieValue = getCookie(cookieName);
if (cookieValue) {
  try {
    const parsedData = JSON.parse(cookieValue); // Parse the JSON string

    if (Array.isArray(parsedData)) {
      options = parsedData;
    } else {
        console.error("Cookie data is not an array");
    }
  } catch (error) {
    console.error("Error parsing cookie JSON:", error);
  }
  }
}


function addNewEntryOption(newEntry)
{
    if (newEntry === "") return "";
    //var result = parsePaperSectionParagraph(newEntry);
    var result = referenceFromString(newEntry)
    entry = `${result.paper}:${result.section}-${result.paragraph}`;
    // Check if the newEntry is already the first item in the options list
    last_index=options.length-1;
    if (options.length > 0 && options[last_index] === entry) {
      return;
    }
    options.push(entry);
    while (options.length > MAX_ITEMS) {
        options.shift(); // Remove the oldest item
    }      
    showParagraphFromComboEntry(entry);
    updateOptionsDisplay();
    trackComboInput.value = ''; // Clear the input field
    trackComboOptions.style.display = 'none';
}


trackComboInput.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    const newOption = trackComboInput.value.trim();
    if (newOption !== "" && !options.includes(newOption)) {
      addNewEntryOption(newOption)
    }
  } else {
    filterOptions(trackComboInput.value);
  }
});

function updateOptionsDisplay() {
    trackComboOptions.innerHTML = ""; // Clear existing options
    for (let i = options.length - 1; i >= 0; i--) {
        const option = options[i];
        const optionDiv = document.createElement('div');
        optionDiv.textContent = option;
        optionDiv.addEventListener('click', () => {
            trackComboInput.value = option;
            trackComboOptions.style.display = 'none';
            showParagraphFromComboEntry(option);
        });
        trackComboOptions.appendChild(optionDiv);
    }
    if (options.length > 0) {
        trackComboOptions.style.display = 'block';
    } else {
        trackComboOptions.style.display = 'none';
    }
    saveCollectionToCookie();
}

function filterOptions(filterText) {
    if (filterText.trim() === "") {
      updateOptionsDisplay();
      return;
    }
    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(filterText.toLowerCase())
    );
    trackComboOptions.innerHTML = "";
    filteredOptions.forEach(option => {
      const optionDiv = document.createElement('div');
      optionDiv.textContent = option;
      optionDiv.addEventListener('click', () => {
          trackComboInput.value = option;
          trackComboOptions.style.display = 'none';
      });
      trackComboOptions.appendChild(optionDiv);
    });
    if(filteredOptions.length>0){
      trackComboOptions.style.display = 'block';
    }else{
      trackComboOptions.style.display = 'none';
    }

}

trackComboInput.addEventListener('blur', function() {
  setTimeout(() => {
    trackComboOptions.style.display = 'none';
  }, 200); // Small delay to allow click event to fire
});

trackComboInput.addEventListener('focus', function(){
  if(options.length>0){
    trackComboOptions.style.display = 'block';
  }
})

const trackComboButton = document.getElementById('mytrackComboButton');

trackComboButton.addEventListener('click', function() {
    if (trackComboOptions.style.display === 'block') {
        trackComboOptions.style.display = 'none';
    } else {
        updateOptionsDisplay();
        trackComboOptions.style.display = 'block';
    }
    trackComboInput.focus();
});

trackComboInput.addEventListener('focus', function(){
  if(options.length>0 && trackComboOptions.style.display !== 'block'){
    trackComboOptions.style.display = 'block';
  }
});

