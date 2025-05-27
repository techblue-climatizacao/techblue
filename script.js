function adicionarItem() {
    const tabela = document.getElementById('tabelaItens').getElementsByTagName('tbody')[0];
    const novaLinha = tabela.insertRow();

    const celula1 = novaLinha.insertCell(0);
    const celula2 = novaLinha.insertCell(1);
    const celula3 = novaLinha.insertCell(2);

    celula1.innerHTML = '<input type="text" class="descricao">';
    celula2.innerHTML = '<input type="number" class="quantidade" value="1">';
    celula3.innerHTML = '<input type="number" class="valor" step="0.01" value="0.00">';
}

function calcularSubtotal() {
    const quantidades = document.getElementsByClassName('quantidade');
    const valores = document.getElementsByClassName('valor');

    let subtotal = 0;
    for (let i = 0; i < quantidades.length; i++) {
        const qtd = parseFloat(quantidades[i].value) || 0;
        const val = parseFloat(valores[i].value) || 0;
        subtotal += qtd * val;
    }
    document.getElementById('subtotal').value = subtotal.toFixed(2);
}

document.addEventListener('input', calcularSubtotal);

async function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const nomeCliente = document.getElementById('nomeCliente').value;
    const telefoneCliente = document.getElementById('telefoneCliente').value;
    const enderecoCliente = document.getElementById('enderecoCliente').value;
    const subtotal = document.getElementById('subtotal').value;
    const observacoes = document.getElementById('observacoes').value;
    const validade = document.getElementById('validade').value;

    let y = 10;

    doc.setFontSize(14);
    doc.text('Techblue Climatização LTDA', 10, y);
    y += 6;
    doc.text('CNPJ: 47.126.600/0001-64', 10, y);

    y += 10;
    doc.setFontSize(12);
    doc.text('Orçamento', 10, y);

    y += 8;
    doc.text(`Cliente: ${nomeCliente}`, 10, y);
    y += 6;
    doc.text(`Telefone: ${telefoneCliente}`, 10, y);
    y += 6;
    doc.text(`Endereço: ${enderecoCliente}`, 10, y);

    y += 10;
    doc.setFontSize(12);
    doc.text('Itens:', 10, y);
    y += 6;

    const descricoes = document.getElementsByClassName('descricao');
    const quantidades = document.getElementsByClassName('quantidade');
    const valores = document.getElementsByClassName('valor');

    for (let i = 0; i < descricoes.length; i++) {
        const desc = descricoes[i].value;
        const qtd = quantidades[i].value;
        const val = valores[i].value;
        doc.text(`- ${desc} | Qtd: ${qtd} | Valor: R$ ${val}`, 10, y);
        y += 6;
        if (y > 270) {
            doc.addPage();
            y = 10;
        }
    }

    y += 6;
    doc.text(`Subtotal: R$ ${subtotal}`, 10, y);

    y += 10;
    doc.text(`Observações: ${observacoes}`, 10, y);

    y += 6;
    doc.text(`Validade do orçamento: ${validade}`, 10, y);

    doc.save(`Orcamento_${nomeCliente}.pdf`);
}
