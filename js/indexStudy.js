
show_home_button= true;

function StartPage() {
    show_home_button= true;
    document.getElementById('leftColumn').innerHTML = "";
    importarArtigos();
}


function lerArquivo(caminho) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(caminho);
    });
}

function parsearArtigos(texto) {
    const linhas = texto.split('\n');
    const artigos = [];
    let artigoAtual = {};
  
    linhas.forEach(linha => {
      if (linha.trim() === '') {
        // Nova entrada de artigo
        if (Object.keys(artigoAtual).length > 0) {
          artigos.push(artigoAtual);
          artigoAtual = {};
        }
      } else {
        const [chave, valor] = linha.split(': ');
        artigoAtual[chave.toLowerCase()] = valor;
      }
    });
  
    if (Object.keys(artigoAtual).length > 0) {
      artigos.push(artigoAtual);
    }
  
    return artigos;
}

function generateCardHtml(artigo) {
    const { titulo, subtitulo, sumario, link } = artigo;
  
    return `
      <div class="card" style="width: 440px;">
        <div class="card-body">
          <h5 class="card-title">${titulo}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${subtitulo}</h6>
          <p class="card-text">${sumario}</p>
          <a href="javascript:open_article('${link}')" class="card-link">Abrir artigo</a>
        </div>
      </div>
    `;
  }
  
  
async function importarArtigos() {

if (!show_home_button) return;

try {
        const caminhoArquivo = 'estudos/artigos.txt';
        const texto = await lerArquivo(caminhoArquivo);
        console.log("Leu o texto:");
        console.log(texto);
        const artigos = parsearArtigos(texto);
        console.log(artigos);
    } catch (error) {
        console.error('Erro ao importar artigos:', error);
    }

    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = ''; // Clear existing content

    try {
        artigos.forEach(artigo => {
        const cardHtml = generateCardHtml(artigo);
        // Append the card to a specific element in your HTML, e.g., a container:
        document.getElementById('card-container').innerHTML += cardHtml;
        });
    } catch (error) {
        console.error('Error importing articles:', error);
    }
}


// function show_home() {
//   if (show_home_button) {
//     importarArtigos()
//       .then(artigos => {

//         artigos.forEach(artigo => {
//           const cardHtml = generateCardHtml(artigo);
//           cardContainer.innerHTML += cardHtml;
//         });
//       })
//       .catch(error => {
//         console.error('Error importing articles:', error);
//       });
//   }
// }
