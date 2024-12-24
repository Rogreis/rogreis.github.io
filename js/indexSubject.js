// Javascript specific for page indexSubject.html

class Item {
    constructor(title, details) {
        this.Title = title;
        this.Details = details.map(detail => new Detail(detail.DetailType, detail.Text, detail.Links));
    }
}

class Detail {
    constructor(detailType, text, links) {
        this.DetailType = detailType;
        this.Text = text;
        this.Links = links;
    }
}

SubjectItems = [];


function StartPage() {
    loadAndUnzipJSON('subject.zip', SubjectPageCallback)
    verifyAnchor();
}

function verifyAnchor() 
{ 
  console.log("verifyAnchor");
  if (!hasAnchor())
    {
      // Load the document at the right column from cookies
      var paper = getCookie("papersub");
      var section = getCookie("sectionsub");
      var paragraph = getCookie("paragraphsub");
      if (typeof paper !== 'string' || paper.trim() === '' ||
      typeof section !== 'string' || section.trim() === '' ||
      typeof paragraph !== 'string' || paragraph.trim() === '') 
      {
        return;
      }
    loadDocByPaperSectionParagraph(paper, section, paragraph);
  }
}


function get_subject_cookies() 
{
    const subject_titles = getCookie('subject_titles');

    if (typeof subject_titles === 'string' && subject_titles.trim().length >= 3) {
        document.getElementById('searchInputBox').value = subject_titles;
        console.log("subject_titles: ", subject_titles);
        findTitlesContainingSubstring(subject_titles)
    }
    else return;

    const subject_selectedTitle = getCookie('subject_selectedTitle');
    if (typeof subject_selectedTitle === 'string' && subject_selectedTitle.trim() !== '') {
        showSubjectDetails(subject_selectedTitle)
    }
}



function SubjectPageCallback(error, data) {
    if (error) {
        console.error("An error occurred while loading or parsing the JSON:", error.message);
    }
     else {
        console.log("Successfully loaded and parsed JSON");
        // Parse JSON data and map to Item class
        SubjectItems = data.map(item => new Item(item.Title, item.Details));
        // Print the total number of items in the array
        console.log("Total number of items:", SubjectItems.length);
        get_subject_cookies() 
    }
}


function loadAndUnzipJSON(url, callback) {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer'; // Fetch the file as binary data
    xhr.onload = async function () {
        if (xhr.status === 200) {
            try {
                const zip = new JSZip();
                const zipContent = await zip.loadAsync(xhr.response); // Load the zip content

                // Assuming the zip contains one JSON file; adjust logic for multiple files
                const fileName = Object.keys(zipContent.files)[0];
                const jsonContent = await zip.file(fileName).async('string');

                // Parse JSON into JavaScript object
                const jsonObject = JSON.parse(jsonContent);

                callback(null, jsonObject);
            } catch (error) {
                callback(error, null);
            }
        } else {
            callback(new Error(`Failed to load file: ${xhr.statusText}`), null);
        }
    };

    xhr.onerror = function () {
        callback(new Error('An error occurred during the XMLHttpRequest'), null);
    };

    xhr.send();
}



function findTitlesContainingSubstring(searchString) {
    if (searchString.length < 3) {
        return;
    }
    setCookie("subject_titles", searchString, 180)
    // Convert search string to lowercase for case-insensitive matching
    const searchLower = searchString.toLowerCase();

    // Filter items based on whether the Title contains the search string
    matchingTitles = SubjectItems
        .filter(item => item.Title.toLowerCase().includes(searchLower))
        .map(item => item.Title); // Extract the Title property

    console.log("Assuntos encontrados: ", matchingTitles.length);

    // Clear and populate the listbox
    const listBox = document.getElementById("listBoxAssuntos");
    listBox.innerHTML = ""; // Clear existing options

    // Add matching titles as new options
    matchingTitles.forEach(title => {
        const option = document.createElement("option");
        option.text = title;
        listBox.add(option);
    });
}

// Convert links array to HTML links
function generateLinksHtml(links) {
    const linkRegex = /^(\d{1,3}):(\d{1,3})\.(\d{1,3})$/; // Matches PPP:SSS.XXX format
    let htmlLinks = "";

    // Ensure links is an array
    if (!Array.isArray(links)) {
        console.error("Expected links to be an array, but got:", typeof links);
        return ""; // Return an empty string if invalid input
    }

    // Iterate over each link in the array
    links.forEach(link => {
        link = link.trim(); // Remove any leading/trailing whitespace
        // Check if the link matches the pattern
        const match = link.match(linkRegex);
        if (match) {
            const [_, PPP, SSS, XXX] = match; // Extract PPP, SSS, and XXX
            // Append the formatted HTML link to the result
            //htmlLinks += `<a href="javascript:loadDoc('content/Doc${PPP}.html','p${PPP}_${SSS}_${XXX}')" class="amadon_link">${PPP}:${SSS}.${XXX}</a><br>`;
            htmlLinks += `<a href="javascript:loadDoc('content/Doc${PPP.padStart(3, '0')}.html','p${PPP.padStart(3, '0')}_${SSS.padStart(3, '0')}_${XXX.padStart(3, '0')}')" class="amadon_link">${PPP}:${SSS}.${XXX}</a> `;
        } else {
            console.warn(`Invalid link format: "${link}"`);
        }
    });

    return htmlLinks;
}


function showSubjectDetails(selectedTitle) {


    // Find the item with the selected title
    const selectedItem = SubjectItems.find(item => item.Title === selectedTitle);
    if (!selectedItem) {
        console.error("Item not found for title:", selectedTitle);
        return
    }
    setCookie("subject_selectedTitle", selectedTitle, 180)

    // Clear and populate the details list
    const detailsList = document.getElementById("detailsList");
    detailsList.innerHTML = "<h3 style=\"color:gold\">" + selectedTitle + "</h3><br>";

    selectedItem.Details.forEach(detail => {
        const detailItem = document.createElement("blockquote");
        if (detail.DetailType === 2) {
            // Create a link to call showSubjectDetails(selectedTitle)
            const link = document.createElement("a");
            link.href = "javascript:void(0)"; // Prevent default navigation
            link.className = "amadon_link"; // Optional: Add a class for styling
            link.textContent = "See also: "+ detail.Links[0];
            link.onclick = () => showSubjectDetails(detail.Links[0]); // Set the click event handler
            detailItem.appendChild(link);
        } else {
            // For other types, add regular text and links
            detailItem.innerHTML = `${detail.Text}<br>${generateLinksHtml(detail.Links)}`;
        }
        detailsList.appendChild(detailItem);
    });
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
    setCookie("papersub", paper, 180)
    setCookie("sectionsub", section, 180)
    setCookie("paragraphsub", paragraph, 180)
    url= `content/Doc${paper.toString().padStart(3, '0')}.html`;
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
