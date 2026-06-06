async function carregarProdutosShopee() {
  const container = document.getElementById("lista-produtos-shopee");

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

  function iconeProduto(produto) {
    const texto = `${produto.nome || ""} ${produto.descricao || ""} ${produto.categoria || ""}`.toLowerCase();

    if (texto.includes("manta") || texto.includes("cerâmica") || texto.includes("ceramica") || texto.includes("temperatura")) return "🔥";
    if (texto.includes("microfibra") || texto.includes("limpeza") || texto.includes("pano")) return "🧽";
    if (texto.includes("toalha") || texto.includes("banho") || texto.includes("rosto") || texto.includes("banheiro")) return "🧺";
    if (texto.includes("edredom") || texto.includes("cobre-leito") || texto.includes("cobre leito") || texto.includes("fronha")) return "🛌";
    if (texto.includes("lençol") || texto.includes("lencol") || texto.includes("colchão") || texto.includes("colchao") || texto.includes("protetor") || texto.includes("cama")) return "🛏️";
    if (texto.includes("ferrament") || texto.includes("alicate") || texto.includes("chave") || texto.includes("furadeira")) return "🧰";

    return "🛒";
  }

  function criarCard(produto) {
    const categoria = escaparHTML(produto.categoria || "Oferta");
    const loja = escaparHTML(produto.loja || "Shopee");
    const nome = escaparHTML(produto.nome || "Produto Shopee");
    const descricao = escaparHTML(produto.descricao || "Produto selecionado com link de afiliado Shopee.");
    const link = escaparHTML(produto.link || "#");
    const icone = escaparHTML(produto.icone || iconeProduto(produto));

    return `
      <article class="card-shopee">
        <div class="produto-icone-shopee" aria-hidden="true">
          <span>${icone}</span>
        </div>

        <span class="selo-shopee">${loja} • ${categoria}</span>

        <h3>${nome}</h3>

        <p>${descricao}</p>

        <a
          class="botao-shopee"
          href="${link}"
          target="_blank"
          rel="noopener sponsored"
        >
          Ver oferta na Shopee
        </a>
      </article>
    `;
  }

  try {
    const resposta = await fetch("data/produtos-shopee.json?v=icones2", {
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

    const grupos = produtos.reduce((acc, produto) => {
      const categoria = produto.categoria || "Outras Ofertas";
      acc[categoria] = acc[categoria] || [];
      acc[categoria].push(produto);
      return acc;
    }, {});

    container.innerHTML = Object.entries(grupos)
      .map(([categoria, itens]) => `
        <section class="categoria-shopee">
          <div class="cabecalho-categoria-shopee">
            <h3>${escaparHTML(categoria)}</h3>
            <span>${itens.length} produto${itens.length > 1 ? "s" : ""}</span>
          </div>

          <div class="grid-shopee">
            ${itens.map(criarCard).join("")}
          </div>
        </section>
      `)
      .join("");
  } catch (erro) {
    console.error("Erro ao carregar produtos Shopee:", erro);
    container.innerHTML = "<p>Não foi possível carregar as ofertas Shopee agora.</p>";
  }
}

document.addEventListener("DOMContentLoaded", carregarProdutosShopee);
