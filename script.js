const products = [
  { id: 1, name: 'Nike Air Max 90', category: 'zapatilla', gender: 'hombre', price: 129.99, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', sizes: ['39','40','41','42','43','44'], colors: ['Negro','Blanco','Rojo','Azul'] },
  { id: 2, name: 'Adidas Ultraboost', category: 'zapatilla', gender: 'hombre', price: 149.99, img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80', sizes: ['39','40','41','42','43','44'], colors: ['Negro','Gris','Azul'] },
  { id: 3, name: 'Nike Air Force 1', category: 'zapatilla', gender: 'mujer', price: 119.99, img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80', sizes: ['34','35','36','37','38','39','40'], colors: ['Blanco','Rosa','Negro'] },
  { id: 4, name: 'Converse Chuck Taylor', category: 'zapatilla', gender: 'mujer', price: 59.99, img: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80', sizes: ['34','35','36','37','38','39','40'], colors: ['Rojo','Negro','Blanco'] },
  { id: 5, name: 'Chaqueta Urbana', category: 'ropa', gender: 'hombre', price: 45.99, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80', sizes: ['S','M','L','XL'], colors: ['Negro','Gris','Verde'] },
  { id: 6, name: 'Polera Premium', category: 'ropa', gender: 'hombre', price: 24.99, img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80', sizes: ['S','M','L','XL'], colors: ['Blanco','Negro','Azul'] },
  { id: 7, name: 'Vestido Casual', category: 'ropa', gender: 'mujer', price: 35.99, img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80', sizes: ['S','M','L'], colors: ['Negro','Rojo','Celeste'] },
  { id: 8, name: 'Chaqueta Mujer', category: 'ropa', gender: 'mujer', price: 49.99, img: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80', sizes: ['S','M','L','XL'], colors: ['Rosa','Negro','Beige'] },
  { id: 9, name: 'Mochila Urbana', category: 'accesorio', gender: 'hombre', price: 34.99, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80' },
  { id: 10, name: 'Reloj Deportivo', category: 'accesorio', gender: 'hombre', price: 45.99, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' },
  { id: 11, name: 'Cartera Elegante', category: 'accesorio', gender: 'mujer', price: 29.99, img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80' },
  { id: 12, name: 'Gafas de Sol', category: 'accesorio', gender: 'mujer', price: 19.99, img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80' },
];

const categoryMap = { zapatilla: 'Zapatilla', ropa: 'Ropa', accesorio: 'Accesorio' };
const genderMap = { hombre: 'Hombre', mujer: 'Mujer' };

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCategory = 'all';
let currentGender = 'all';
let modalProduct = null;
let modalQty = 1;
let modalSize = '';
let modalColor = '';

function formatPrice(price) {
  return 'S/' + price.toFixed(2);
}

function renderProducts(category = 'all', gender = 'all', sort = 'default') {
  const grid = document.getElementById('productGrid');
  let filtered = [...products];

  if (category !== 'all') filtered = filtered.filter(p => p.category === category);
  if (gender !== 'all') filtered = filtered.filter(p => p.gender === gender);

  switch (sort) {
    case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
    case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
    case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
  }

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-cart" style="grid-column:1/-1;padding:60px 0">No hay productos en esta categoría</div>';
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-id="${p.id}">
      <img class="product-img" src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="product-info">
        <div class="product-gender">${genderMap[p.gender]}</div>
        <div class="product-category">${categoryMap[p.category]}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-price">${formatPrice(p.price)}</div>
        <button class="add-to-cart" data-id="${p.id}">Agregar al Carrito</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = +btn.dataset.id;
      openModal(products.find(x => x.id === id));
    });
  });

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = +card.dataset.id;
      openModal(products.find(x => x.id === id));
    });
  });
}

function openModal(product) {
  modalProduct = product;
  modalQty = 1;
  modalSize = '';
  modalColor = '';

  document.getElementById('modalImg').src = product.img;
  document.getElementById('modalImg').alt = product.name;
  document.getElementById('modalGender').textContent = genderMap[product.gender];
  document.getElementById('modalCategory').textContent = categoryMap[product.category];
  document.getElementById('modalName').textContent = product.name;
  document.getElementById('modalPrice').textContent = formatPrice(product.price);
  document.getElementById('modalQty').textContent = '1';

  const sizeGroup = document.getElementById('sizeGroup');
  const colorGroup = document.getElementById('colorGroup');

  if (product.category === 'accesorio') {
    sizeGroup.style.display = 'none';
    colorGroup.style.display = 'none';
  } else {
    sizeGroup.style.display = 'flex';
    colorGroup.style.display = 'flex';

    const sizeContainer = document.getElementById('sizeOptions');
    sizeContainer.innerHTML = product.sizes.map(s =>
      `<button class="option-btn" data-value="${s}">${s}</button>`
    ).join('');
    sizeContainer.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sizeContainer.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        modalSize = btn.dataset.value;
      });
    });

    const colorContainer = document.getElementById('colorOptions');
    colorContainer.innerHTML = product.colors.map(c =>
      `<button class="option-btn" data-value="${c}">${c}</button>`
    ).join('');
    colorContainer.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        colorContainer.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        modalColor = btn.dataset.value;
      });
    });
  }

  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  modalProduct = null;
}

function addToCartFromModal() {
  if (!modalProduct) return;
  if (modalProduct.category !== 'accesorio') {
    if (!modalSize) { alert('Selecciona una talla'); return; }
    if (!modalColor) { alert('Selecciona un color'); return; }
  }

  const existing = cart.find(item =>
    item.id === modalProduct.id &&
    item.size === modalSize &&
    item.color === modalColor
  );

  if (existing) {
    existing.qty += modalQty;
  } else {
    cart.push({ ...modalProduct, qty: modalQty, size: modalSize, color: modalColor });
  }

  updateCart();
  closeModal();
}

function removeFromCart(id, size, color) {
  cart = cart.filter(item => !(item.id === id && item.size === size && item.color === color));
  updateCart();
}

function updateQty(id, size, color, delta) {
  const item = cart.find(i => i.id === id && i.size === size && i.color === color);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id, size, color);
      return;
    }
  }
  updateCart();
}

function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  document.getElementById('cartCount').textContent = cart.reduce((sum, i) => sum + i.qty, 0);
}

function renderCart() {
  const container = document.getElementById('cartItems');
  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-cart">Tu carrito está vacío</div>';
    document.getElementById('cartTotal').textContent = 'S/0.00';
    return;
  }

  container.innerHTML = cart.map(item => {
    const variant = [item.size, item.color].filter(Boolean).join(' - ');
    return `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.img}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          ${variant ? `<div class="cart-item-variant">${variant}</div>` : ''}
          <div class="cart-item-price">${formatPrice(item.price)}</div>
          <div class="cart-item-qty">
            <button onclick="updateQty(${item.id},'${item.size}','${item.color}',-1)">−</button>
            <span>${item.qty}</span>
            <button onclick="updateQty(${item.id},'${item.size}','${item.color}',1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id},'${item.size}','${item.color}')">&times;</button>
      </div>
    `;
  }).join('');

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById('cartTotal').textContent = formatPrice(total);
}

function sendWhatsapp() {
  if (cart.length === 0) return;
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  let msg = '🛍️ *RESUMEN DE COMPRA - AdierStore* 🛍️%0A%0A';
  cart.forEach((item, i) => {
    const subtotal = item.price * item.qty;
    const variant = [item.size, item.color].filter(Boolean).join(' - ');
    msg += `*${i + 1}. ${item.name}*%0A`;
    msg += `   📸 ${item.img}%0A`;
    msg += `   Categoría: ${categoryMap[item.category]} | ${genderMap[item.gender]}%0A`;
    if (variant) msg += `   Variante: ${variant}%0A`;
    msg += `   Precio: ${formatPrice(item.price)}%0A`;
    msg += `   Cantidad: ${item.qty}%0A`;
    msg += `   Subtotal: ${formatPrice(subtotal)}%0A%0A`;
  });
  msg += `──────────────────%0A`;
  msg += `*TOTAL: ${formatPrice(total)}*%0A`;
  msg += `──────────────────%0A%0A`;
  msg += `¡Gracias por tu compra! 🙌`;

  window.open(`https://wa.me/51904529674?text=${msg}`, '_blank');
}

document.querySelectorAll('[data-category]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const cat = el.dataset.category;
    currentCategory = cat;
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.dataset.category === cat));
    renderProducts(currentCategory, currentGender, document.getElementById('sortBy').value);
  });
});

document.querySelectorAll('[data-gender]').forEach(el => {
  el.addEventListener('click', () => {
    const gen = el.dataset.gender;
    currentGender = gen;
    document.querySelectorAll('.filter-gender').forEach(b => b.classList.toggle('active', b.dataset.gender === gen));
    renderProducts(currentCategory, currentGender, document.getElementById('sortBy').value);
  });
});

document.getElementById('sortBy').addEventListener('change', function () {
  renderProducts(currentCategory, currentGender, this.value);
});

document.getElementById('cartIcon').addEventListener('click', () => {
  document.getElementById('cartOverlay').classList.add('open');
});

document.getElementById('closeCart').addEventListener('click', () => {
  document.getElementById('cartOverlay').classList.remove('open');
});

document.getElementById('cartOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) {
    document.getElementById('cartOverlay').classList.remove('open');
  }
});

document.getElementById('btnWhatsapp').addEventListener('click', sendWhatsapp);

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

document.getElementById('modalQtyDown').addEventListener('click', () => {
  if (modalQty > 1) {
    modalQty--;
    document.getElementById('modalQty').textContent = modalQty;
  }
});

document.getElementById('modalQtyUp').addEventListener('click', () => {
  modalQty++;
  document.getElementById('modalQty').textContent = modalQty;
});

document.getElementById('modalAddBtn').addEventListener('click', addToCartFromModal);

document.querySelector('.nav-links a[data-category="all"]').classList.add('active');
renderProducts();
updateCart();
