let inventory = JSON.parse(localStorage.getItem('vintedStock')) || [];
let showOnlyProfit = true; // Alternador global

function saveAndRender() {
    localStorage.setItem('vintedStock', JSON.stringify(inventory));
    renderTable();
}

function addItem() {
    const name = document.getElementById('item-name').value;
    const cost = parseFloat(document.getElementById('purchase-price').value);
    let imgUrl = document.getElementById('item-image').value;

    if (!name || isNaN(cost)) {
        alert("Preenche os campos obrigatórios!");
        return;
    }

    const newItem = {
        id: Date.now(),
        name: name,
        cost: cost,
        salePrice: null,
        img: imgUrl || 'https://via.placeholder.com/65?text=Item',
        status: 'Disponível'
    };

    inventory.push(newItem);
    document.getElementById('item-name').value = '';
    document.getElementById('purchase-price').value = '';
    document.getElementById('item-image').value = '';
    saveAndRender();
}

function sellItem(id) {
    const val = prompt("Preço de venda (€):");
    if (val && !isNaN(val)) {
        const idx = inventory.findIndex(i => i.id === id);
        inventory[idx].salePrice = parseFloat(val);
        inventory[idx].status = 'Vendido';
        saveAndRender();
    }
}

function deleteItem(id) {
    inventory = inventory.filter(i => i.id !== id);
    saveAndRender();
}

function toggleRevenue() {
    showOnlyProfit = !showOnlyProfit;
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('inventory-body');
    tbody.innerHTML = '';
    
    let totalItemsCount = 0;    // Mudamos para contar TODAS as peças do inventário
    let totalInvested = 0;     // Custo total de TUDO o que compraste
    let totalProfit = 0;       // Soma dos lucros
    let totalSalesValue = 0;   // Soma bruta das vendas

    inventory.forEach(item => {
        // Agora contamos a peça e o custo dela, independentemente de estar vendida ou não
        totalItemsCount++; 
        totalInvested += item.cost;

        let saleTxt = '-';
        let profitTxt = '-';

        if (item.status === 'Vendido') {
            const p = item.salePrice - item.cost;
            totalProfit += p;
            totalSalesValue += item.salePrice;
            saleTxt = `${item.salePrice.toFixed(2)}€`;
            profitTxt = `<span style="color:${p>=0?'#2ed573':'#ff4757'}">${p.toFixed(2)}€</span>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${item.img}" class="img-preview"></td>
            <td><strong>${item.name}</strong></td>
            <td>${item.cost.toFixed(2)}€</td>
            <td>${saleTxt}</td>
            <td>${profitTxt}</td>
            <td><span class="badge ${item.status==='Vendido'?'sold':'available'}">${item.status}</span></td>
            <td>
                ${item.status==='Disponível'?`<button onclick="sellItem(${item.id})" class="btn-sell">Vender</button>`:''}
                <button onclick="deleteItem(${item.id})" class="btn-delete">Apagar</button>
            </td>`;
        tbody.appendChild(tr);
    });

    // Atualiza os cards no topo
    document.getElementById('total-items').innerText = totalItemsCount;
    document.getElementById('total-investment').innerText = totalInvested.toFixed(2) + '€';
    
    const revVal = document.getElementById('total-revenue');
    const revLabel = document.getElementById('revenue-label');
    
    if (showOnlyProfit) {
        revLabel.innerText = "Lucro Total";
        revVal.innerText = totalProfit.toFixed(2) + '€';
    } else {
        revLabel.innerText = "Faturamento Bruto";
        revVal.innerText = totalSalesValue.toFixed(2) + '€';
    }
}