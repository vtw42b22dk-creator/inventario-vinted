let inventory = JSON.parse(localStorage.getItem('vintedStock')) || [];

function saveAndRender() {
    localStorage.setItem('vintedStock', JSON.stringify(inventory));
    renderTable();
}

function addItem() {
    const name = document.getElementById('item-name').value;
    const cost = parseFloat(document.getElementById('purchase-price').value);
    let imgUrl = document.getElementById('item-image').value;

    if (!name || isNaN(cost)) {
        alert("Preenche o Nome e o Custo!");
        return;
    }

    if (!imgUrl) imgUrl = 'https://via.placeholder.com/65?text=Item';

    const newItem = {
        id: Date.now(),
        name: name,
        cost: cost,
        salePrice: null,
        img: imgUrl,
        status: 'Disponível'
    };

    inventory.push(newItem);
    document.getElementById('item-name').value = '';
    document.getElementById('purchase-price').value = '';
    document.getElementById('item-image').value = '';
    
    saveAndRender();
}

function sellItem(id) {
    const saleValue = prompt("Por quanto vendeste esta peça? (€)");
    if (saleValue !== null && saleValue !== "" && !isNaN(saleValue)) {
        const itemIndex = inventory.findIndex(i => i.id === id);
        inventory[itemIndex].salePrice = parseFloat(saleValue);
        inventory[itemIndex].status = 'Vendido';
        saveAndRender();
    }
}

// Apaga logo sem confirmação
function deleteItem(id) {
    inventory = inventory.filter(i => i.id !== id);
    saveAndRender();
}

function renderTable() {
    const tbody = document.getElementById('inventory-body');
    tbody.innerHTML = '';

    let activeStockCount = 0;
    let totalInvestment = 0;

    inventory.forEach(item => {
        if (item.status === 'Disponível') {
            activeStockCount++;
            totalInvestment += item.cost;
        }

        let saleHtml = '-';
        let profitHtml = '-';
        
        if (item.status === 'Vendido') {
            const profit = item.salePrice - item.cost;
            const profitColor = profit >= 0 ? 'var(--success)' : 'var(--danger)';
            saleHtml = `${item.salePrice.toFixed(2)}€`;
            profitHtml = `<span style="color: ${profitColor}; font-weight: bold;">${profit.toFixed(2)}€</span>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${item.img}" class="img-preview"></td>
            <td><strong>${item.name}</strong></td>
            <td>${item.cost.toFixed(2)}€</td>
            <td>${saleHtml}</td>
            <td>${profitHtml}</td>
            <td><span class="badge ${item.status === 'Vendido' ? 'sold' : 'available'}">${item.status}</span></td>
            <td>
                ${item.status === 'Disponível' ? `<button onclick="sellItem(${item.id})" class="btn-sell">Vender</button>` : ''}
                <button onclick="deleteItem(${item.id})" class="btn-delete">Apagar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('total-items').innerText = activeStockCount;
    document.getElementById('total-investment').innerText = totalInvestment.toFixed(2) + '€';
}

renderTable();
