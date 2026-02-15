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

    let activeCount = 0;
    let totalInvest = 0;
    let totalProfit = 0;
    let totalSales = 0;

    inventory.forEach(item => {
        if (item.status === 'Disponível') {
            activeCount++;
            totalInvest += item.cost;
        }

        let saleTxt = '-';
        let profitTxt = '-';

        if (item.status === 'Vendido') {
            const p = item.salePrice - item.cost;
            totalProfit += p;
            totalSales += item.salePrice;
            saleTxt = `${item.salePrice.toFixed(2)}€`;
            profitTxt = `<span style="color:${p>=0?'var(--success)':'var(--danger)'}">${p.toFixed(2)}€</span>`;
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
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Atualizar Dashboard
    document.getElementById('total-items').innerText = activeCount;
    document.getElementById('total-investment').innerText = totalInvest.toFixed(2) + '€';

    const revLabel = document.getElementById('revenue-label');
    const revVal = document.getElementById('total-revenue');
    const revIcon = document.getElementById('revenue-icon');

    if (showOnlyProfit) {
        revLabel.innerText = "Lucro Total";
        revVal.innerText = totalProfit.toFixed(2) + '€';
        revIcon.className = "fas fa-chart-line";
    } else {
        revLabel.innerText = "Vendas Totais";
        revVal.innerText = totalSales.toFixed(2) + '€';
        revIcon.className = "fas fa-hand-holding-dollar";
    }
}

renderTable();