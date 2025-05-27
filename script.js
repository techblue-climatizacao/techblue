function adicionarItem() {
  const tbody = document.querySelector("#tabelaItens tbody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td><input type="text" class="descricao"></td>
    <td><input type="number" class="quantidade" value="1" min="1"></td>
    <td><input type="number" class="valor" value="0" step="0.01" min="0"></td>
    <td><button onclick="removerItem(this)">Remover</button></td>
  `;

  tbody.appendChild(row);
  atualizarSubtotal();
  row.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", atualizarSubtotal);
  });
}

function removerItem(botao) {
  botao.parentElement.parentElement.remove();
  atualizarSubtotal();
}

function atualizarSubtotal() {
  let subtotal = 0;
  document.querySelectorAll("#tabelaItens tbody tr").forEach(row => {
    const qtd = parseFloat(row.querySelector(".quantidade").value) || 0;
    const val = parseFloat(row.querySelector(".valor").value) || 0;
    subtotal += qtd * val;
  });
  document.getElementById("subtotal").innerText = subtotal.toFixed(2);
}

function gerarPDF() {
  const element = document.getElementById("orcamento");
  html2pdf().from(element).save(`Orcamento-${document.getElementById("nomeCliente").value}.pdf`);
  enviarParaPlanilha(); // envia os dados também
}

function enviarParaPlanilha() {
  const nome = document.getElementById("nomeCliente").value;
  const telefone = document.getElementById("telefoneCliente").value;
  const validade = document.getElementById("validade").value;
  const observacao = document.getElementById("observacao").value;

  const itens = [];
  document.querySelectorAll("#tabelaItens tbody tr").forEach(row => {
    const descricao = row.querySelector(".descricao").value;
    const quantidade = row.querySelector(".quantidade").value;
    const valor = row.querySelector(".valor").value;
    itens.push({ descricao, quantidade, valor });
  });

  const dados = {
    nome,
    telefone,
    validade,
    observacao,
    subtotal: document.getElementById("subtotal").innerText,
    itens: JSON.stringify(itens)
  };

  fetch("https://api.sheetbest.com/sheets/a82a7fd0-e574-41f9-bb8c-c01a683a83ec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
  }).then(res => {
    if (res.ok) {
      console.log("Enviado para a planilha com sucesso!");
    }
  });
}

// Máscara para telefone
document.getElementById("telefoneCliente").addEventListener("input", function(e) {
  let x = e.target.value.replace(/\D/g, "").match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
  e.target.value = !x[2] ? x[1] : `(${x[1]}) ${x[2]}${x[3] ? "-" + x[3] : ""}`;
});


