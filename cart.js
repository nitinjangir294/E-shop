// Cart stored in localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  saveCart(cart);
  showToast(`"${product.name}" added to cart!`);
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCartPage();
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) return removeFromCart(id);
  saveCart(cart);
  renderCartPage();
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'inline' : 'none';
  });
}

function showToast(msg) {
  const el = document.getElementById('cartToast');
  if (!el) return;
  el.querySelector('.toast-body').innerHTML = `<i class="bi bi-check-circle"></i> ${msg}`;
  new bootstrap.Toast(el).show();
}

function renderCartPage() {
  const container = document.getElementById('cart-items');
  const summary = document.getElementById('cart-summary');
  if (!container) return;
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-cart-x" style="font-size:4rem;color:#ccc;"></i>
        <h5 class="mt-3 text-muted">Your cart is empty</h5>
        <a href="products.html" class="btn btn-primary mt-3">Browse Products</a>
      </div>`;
    summary.innerHTML = '';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item d-flex align-items-center gap-3 p-3 mb-3 bg-white rounded shadow-sm">
      <img src="${item.img}" width="80" height="70" style="object-fit:cover;border-radius:8px;" alt="${item.name}"/>
      <div class="flex-grow-1">
        <h6 class="mb-0 fw-bold">${item.name}</h6>
        <small class="text-muted">${item.category}</small>
        <div class="text-danger fw-bold">₹${item.price}</div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-outline-secondary btn-sm" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="fw-bold">${item.qty}</span>
        <button class="btn btn-outline-secondary btn-sm" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <div class="fw-bold" style="min-width:70px;text-align:right;">₹${item.price * item.qty}</div>
      <button class="btn btn-sm text-danger" onclick="removeFromCart(${item.id})"><i class="bi bi-trash"></i></button>
    </div>`).join('');

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;

  summary.innerHTML = `
    <div class="bg-white rounded shadow-sm p-4">
      <h5 class="fw-bold mb-3">Order Summary</h5>
      <div class="d-flex justify-content-between mb-2"><span>Subtotal</span><span>₹${subtotal}</span></div>
      <div class="d-flex justify-content-between mb-2"><span>Shipping</span><span>${shipping === 0 ? '<span class="text-success">Free</span>' : '₹' + shipping}</span></div>
      <hr/>
      <div class="d-flex justify-content-between fw-bold fs-5 mb-3"><span>Total</span><span class="text-danger">₹${total}</span></div>
      <button class="btn btn-primary w-100" onclick="placeOrder()">Place Order <i class="bi bi-bag-check"></i></button>
      <a href="products.html" class="btn btn-outline-secondary w-100 mt-2">Continue Shopping</a>
    </div>`;
}

function placeOrder() {
  localStorage.removeItem('cart');
  updateCartBadge();
  document.getElementById('cart-items').innerHTML = `
    <div class="text-center py-5">
      <i class="bi bi-check-circle-fill text-success" style="font-size:4rem;"></i>
      <h4 class="mt-3 fw-bold">Order Placed Successfully!</h4>
      <p class="text-muted">Thank you for shopping with ShopEase. You'll receive a confirmation soon.</p>
      <a href="products.html" class="btn btn-primary mt-2">Continue Shopping</a>
    </div>`;
  document.getElementById('cart-summary').innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderCartPage();
});
