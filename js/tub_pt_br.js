
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
    LoadColumnLeft("index");
}

function LoadColumnLeft(typeData) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      document.getElementById('leftColumn').innerHTML = this.responseText;
      ExpandIndex();
    }
    xhttp.open("GET", 'content/TocTable.html');
    xhttp.send();
}

function loadDoc(url, hash) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() 
    {
      document.getElementById('rightColumn').innerHTML = this.responseText;
      if (hash) 
      {
        location.hash = "#" + hash;
      }      
    }
    xhttp.open("GET", url);
    xhttp.send();
  }
  
  var modal;
  var textEditaData= 
  {
    paperNo: -1,
    sectionNo: -1,
    paragraphNo: -1,
    status: 3, 
    nt: "nada a observar", 
    comment: "Aqui temos uma mudança",
    text: "XXXXXXXX Há 360 milhões de anos as terras ainda se estavam elevando. A América do Norte e do Sul encontravam-se bem altas. A Europa ocidental e as Ilhas Britânicas estavam emergindo, exceto partes do País de Gales, que se achavam profundamente submersas. Não havia grandes lençóis de gelo durante estas idades. Os supostos depósitos glaciais que surgiram em conexão com esses estratos na Europa, África, China e Austrália são devidos às geleiras de montanha isoladas ou ao deslocamento de detritos glaciais de origem posterior. O clima mundial era oceânico, não continental. Os mares do sul eram então mais tépidos do que atualmente e se estendiam desde a América do Norte até as regiões polares. A corrente do Golfo corria pela parte central da América do Norte, sendo desviada na direção leste para banhar e aquecer as margens da Groenlândia, fazendo daquele continente, hoje coberto por um manto de gelo, um verdadeiro paraíso tropical.",

    ident()
    {
        return textEditaData.paperNo.toString() + ':' + textEditaData.sectionNo.toString() + '.' + textEditaData.paragraphNo.toString();
    },

    pageDivId()
    {
      return 'd' + textEditaData.paperNo.toString() + '_' + textEditaData.sectionNo.toString() + '_' + textEditaData.paragraphNo.toString();
    }
  }


  function ChangeStatus(st)
  {
    $("#divEditParagraph").removeClass();
    switch(st)
    {
      case 0:
        modal.hide();
        break;
      case 1:
        $("#divEditParagraph").attr('class', 'card-body parWorking');
        $("#EditParagraph").attr('class', 'parWorking');
        break;
      case 2:
        $("#divEditParagraph").attr('class', 'card-body parDoubt');
        $("#EditParagraph").attr('class', 'parDoubt');
        break;
      case 3:
        $("#divEditParagraph").attr('class', 'card-body parOk');
        $("#EditParagraph").attr('class', 'parOk');
        break;
      case 4:
        $("#divEditParagraph").attr('class', 'card-body parClosed');
        $("#EditParagraph").attr('class', 'parClosed');
        break;
      case 9:
        updatePageData();
        modal.hide();
        break;
      }
  }

  var modalOptions= {
    show: true,
    keyboard: false,
    backdrop: 'static'
  };


  function loadEditData()
  {
    modalWaiting= $('#modalWaiting');
    modalWaiting.options= modalOptions;
    modalWaiting.show();
    //console.log("3")
    delaySeconds(modalWaiting)
    return 0;
  }

  function delaySeconds(modal) {
    setTimeout(function () {
      modal.hide();
      window.status='Edit text data loaded.'
      showEditData();
    }, 1000);
}

  function updatePageData()
  {
    console.log('updatePageData: ' + textEditaData.pageDivId());
    $("#" + textEditaData.pageDivId()).html(textEditaData.text);
  }

  function showEditData()
  {
    ChangeStatus(textEditaData.status);
    $("#EditTitle").html('Edit ' + textEditaData.ident());
    $("#EditParagraph").val(textEditaData.text);
    $("#CommentsParagraph").val(textEditaData.comment);
    $("#TranslationNotesParagraph").val(textEditaData.nt);

    modal= $('#editChildWindow');
    modal.options= modalOptions;
    modal.show();
  }

  function openEdit(parIdent)
  {
    const words = parIdent.split(';');
    textEditaData.paperNo= parseInt(words[0]);
    textEditaData.sectionNo= parseInt(words[1]);
    textEditaData.paragraphNo= parseInt(words[2]);
    console.log('Ident: ' + textEditaData.ident());
    window.status='Loading edit text data...'
    ret= loadEditData();
  }

  