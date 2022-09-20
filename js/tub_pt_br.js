
function ExpandIndex()
{
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
}


function StartPage() {
    alert("Start page");
    LoadColumnLeft("index");
    //$("#leftColumn").load("content/index.txt");    
    //ExpandIndex();
}

function LoadColumnLeft(typeData) {
    alert(typeData);
    //$("#leftColumn").load("content/index.txt");    
    //ExpandIndex();
}
