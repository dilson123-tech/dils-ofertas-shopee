document.addEventListener("DOMContentLoaded", function () {
  console.log("Dils Ofertas está no ar!");
});

function ampliarImagem(img) {
  const modal = document.createElement("img");
  modal.src = img.src;
  modal.classList.add("modal-img");
  modal.onclick = () => modal.remove();
  document.body.appendChild(modal);
}



//function trocarImagem(src) {
  //document.getElementById("imagem-principal").src = src;
//}


// === Catálogo dinâmico de produtos Shopee ===
async function carregarProdutosShopee() {
  const container = document.getElementById("lista-produtos-amazon");

  if (!container) {
    return;
  }

  function escaparHTML(valor) {
    return String(valor || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function obterIconeCategoria(categoria) {
    const nome = String(categoria || "").toLowerCase();

    if (nome.includes("cozinha") || nome.includes("casa")) return "🍳";
    if (nome.includes("beleza")) return "✨";
    if (nome.includes("eletr")) return "🎧";
    if (nome.includes("inform")) return "💻";
    if (nome.includes("ferrament")) return "🧰";
    if (nome.includes("achadinho")) return "💡";

    return "🛒";
  }

  function criarCardProduto(produto) {
    const categoriaOriginal = produto.categoria || "Oferta";
    const categoria = escaparHTML(categoriaOriginal);
    const icone = escaparHTML(obterIconeCategoria(categoriaOriginal));
    const loja = escaparHTML(produto.loja || "Shopee");
    const nome = escaparHTML(produto.nome);
    const descricao = escaparHTML(produto.descricao);
    const link = escaparHTML(produto.link);
    const imagem = escaparHTML(produto.imagem || "");

    const imagemHTML = imagem
      ? `
        <a href="${link}" target="_blank" rel="noopener sponsored" class="imagem-amazon-link">
          <img src="${imagem}" alt="${nome}" class="imagem-produto-amazon" loading="lazy">
        </a>
      `
      : `
        <div class="produto-icone-amazon" aria-hidden="true">
          <span>${icone}</span>
        </div>
      `;

    return `
      <article class="card-amazon">
        ${imagemHTML}
        <span class="selo-amazon">${loja} • ${categoria}</span>
        <h3>${nome}</h3>
        <p>${descricao}</p>
        <a
          href="${link}"
          target="_blank"
          rel="noopener sponsored"
          class="botao-amazon"
        >
          Ver oferta na Shopee
        </a>
      </article>
    `;
  }

  try {
    const resposta = await fetch("data/produtos-shopee.json", {
      cache: "no-store",
    });

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar o catálogo Shopee.");
    }

    const produtos = await resposta.json();

    if (!Array.isArray(produtos) || produtos.length === 0) {
      container.innerHTML = "<p>Nenhuma oferta Shopee cadastrada no momento.</p>";
      return;
    }

    const produtosPorCategoria = produtos.reduce((grupos, produto) => {
      const categoria = produto.categoria || "Outras Ofertas";

      if (!grupos[categoria]) {
        grupos[categoria] = [];
      }

      grupos[categoria].push(produto);
      return grupos;
    }, {});

    container.innerHTML = Object.entries(produtosPorCategoria)
      .map(([categoria, itens]) => {
        const tituloCategoria = escaparHTML(categoria);

        return `
          <section class="categoria-amazon">
            <div class="cabecalho-categoria-amazon">
              <h3>${tituloCategoria}</h3>
              <span>${itens.length} produto${itens.length > 1 ? "s" : ""}</span>
            </div>

            <div class="grid-amazon">
              ${itens.map(criarCardProduto).join("")}
            </div>
          </section>
        `;
      })
      .join("");
  } catch (erro) {
    console.error("Erro ao carregar produtos Shopee:", erro);
    container.innerHTML = "<p>Não foi possível carregar as ofertas Shopee agora.</p>";
  }
}

document.addEventListener("DOMContentLoaded", carregarProdutosShopee);
