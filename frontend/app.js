const API_BASE_STORAGE_KEY = "chieu_api_base";
const CART_STORAGE_KEY = "chieu_shop_cart";

const apiBaseInput = document.getElementById("apiBase");
const productsGrid = document.getElementById("productsGrid");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");
const apiConfigModal = document.getElementById("apiConfigModal");
const paymentMethod = document.getElementById("paymentMethod");
const checkoutBtn = document.getElementById("checkoutBtn");
const userBadge = document.getElementById("userBadge");
const openAuth = document.getElementById("openAuth");
const closeAuth = document.getElementById("closeAuth");
const authModal = document.getElementById("authModal");
const logoutBtn = document.getElementById("logoutBtn");
const authStatus = document.getElementById("authStatus");

let products = [];
let currentUser = null;
let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

function currency(value) {
  return Number(value || 0).toLocaleString("vi-VN") + " đ";
}

function getApiBase() {
  return localStorage.getItem(API_BASE_STORAGE_KEY) || "http://localhost:3000/api/v1";
}

function getImage(product) {
  if (Array.isArray(product.images) && product.images.length > 0) return product.images[0];
  if (typeof product.images === "string" && product.images) return product.images;
  return "https://niteair.co.uk/wp-content/uploads/2023/08/default-product-image.png";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 1700);
}

function setAuthUI() {
  if (currentUser) {
    userBadge.textContent = currentUser.username || currentUser.email || "User";
    userBadge.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    openAuth.classList.add("hidden");
  } else {
    userBadge.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    openAuth.classList.remove("hidden");
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${getApiBase()}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "include",
    ...options,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) throw new Error(typeof data === "string" ? data : data?.message || "Lỗi API");
  return data;
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  renderCart();
}

function mapServerCart(serverCart) {
  const items = serverCart?.items || [];
  return items
    .filter((it) => it.product)
    .map((it) => ({
      productId: it.product._id,
      title: it.product.title,
      price: Number(it.product.price || 0),
      image: getImage(it.product),
      quantity: Number(it.quantity || 1),
    }));
}

async function loadServerCart() {
  if (!currentUser) return;
  try {
    const serverCart = await request("/carts");
    cart = mapServerCart(serverCart);
    saveCart();
  } catch {
    // ignore
  }
}

async function syncItemToServer(productId, quantity) {
  if (!currentUser) return;
  await request("/carts", {
    method: "POST",
    body: JSON.stringify({ product: productId, quantity }),
  });
}

async function addToCart(productId) {
  const p = products.find((x) => x._id === productId);
  if (!p) return;
  const item = cart.find((x) => x.productId === productId);
  if (item) {
    item.quantity += 1;
    await syncItemToServer(productId, item.quantity);
  } else {
    cart.push({ productId, title: p.title, price: Number(p.price || 0), image: getImage(p), quantity: 1 });
    await syncItemToServer(productId, 1);
  }
  saveCart();
  showToast("Đã thêm vào giỏ hàng");
}

async function removeCartItem(productId) {
  cart = cart.filter((x) => x.productId !== productId);
  saveCart();
  if (currentUser) await request(`/carts/${productId}`, { method: "DELETE" });
}

async function clearCart() {
  cart = [];
  saveCart();
  if (currentUser) await request("/carts", { method: "DELETE" });
}

function renderCart() {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  cartCount.textContent = String(totalQty);
  cartTotal.textContent = currency(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML = "<p class='empty'>Giỏ hàng đang trống.</p>";
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
      <article class="cart-item">
        <img src="${item.image}" alt="${item.title}" />
        <div>
          <strong>${item.title}</strong>
          <div class="qty">SL: ${item.quantity} · ${currency(item.price)}</div>
        </div>
        <button class="btn-outline" data-remove="${item.productId}">Xóa</button>
      </article>
    `,
    )
    .join("");
}

function filteredProducts() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const sortBy = sortFilter.value;
  let data = [...products].filter((p) => !p.isDeleted);
  if (selectedCategory) data = data.filter((p) => String(p.category) === selectedCategory);
  if (keyword) data = data.filter((p) => String(p.title || "").toLowerCase().includes(keyword));
  if (sortBy === "price-asc") data.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  if (sortBy === "price-desc") data.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
  if (sortBy === "name-asc") data.sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
  return data;
}

function renderProducts() {
  const list = filteredProducts();
  emptyState.classList.toggle("hidden", list.length > 0);
  productsGrid.innerHTML = list
    .map(
      (p) => `
      <article class="product-card">
        <img class="product-thumb" src="${getImage(p)}" alt="${p.title}" />
        <div class="product-content">
          <h3 class="product-title">${p.title || "Sản phẩm"}</h3>
          <div class="meta">Danh mục: ${p.category || "Khác"}</div>
          <div class="price-row">
            <div class="price">${currency(p.price)}</div>
            <button class="btn-primary" data-add="${p._id}">Thêm</button>
          </div>
        </div>
      </article>
    `,
    )
    .join("");
}

async function loadData() {
  try {
    const [categoryData, productData] = await Promise.all([request("/categories"), request("/products")]);
    const categories = Array.isArray(categoryData) ? categoryData : [];
    products = Array.isArray(productData) ? productData : [];
    categoryFilter.innerHTML = `<option value="">Tất cả danh mục</option>${categories
      .map((c) => `<option value="${c.name}">${c.name}</option>`)
      .join("")}`;
    renderProducts();
  } catch (error) {
    showToast(`Không tải được dữ liệu: ${error.message}`);
  }
}

async function fetchMe() {
  try {
    currentUser = await request("/auth/me");
  } catch {
    currentUser = null;
  }
  setAuthUI();
}

async function checkout() {
  if (!currentUser) {
    showToast("Cần đăng nhập để thanh toán");
    authModal.classList.remove("hidden");
    return;
  }
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  if (!totalPrice) {
    showToast("Giỏ hàng đang trống");
    return;
  }
  await request("/payments", {
    method: "POST",
    body: JSON.stringify({ method: paymentMethod.value, amount: totalPrice, status: "pending" }),
  });
  await clearCart();
  showToast("Thanh toán thành công");
}

document.getElementById("saveApiBase").addEventListener("click", () => {
  localStorage.setItem(API_BASE_STORAGE_KEY, apiBaseInput.value.trim());
  apiConfigModal.classList.add("hidden");
  showToast("Đã lưu API Base");
  loadData();
});

document.getElementById("openApiConfig").addEventListener("click", () => apiConfigModal.classList.remove("hidden"));
document.getElementById("closeApiConfig").addEventListener("click", () => apiConfigModal.classList.add("hidden"));
document.getElementById("openCart").addEventListener("click", () => cartPanel.classList.add("open"));
document.getElementById("closeCart").addEventListener("click", () => cartPanel.classList.remove("open"));
document.getElementById("clearCart").addEventListener("click", async () => {
  await clearCart();
  showToast("Đã xóa giỏ hàng");
});
document.getElementById("refreshProducts").addEventListener("click", loadData);
checkoutBtn.addEventListener("click", async () => {
  try {
    await checkout();
  } catch (error) {
    showToast(`Thanh toán lỗi: ${error.message}`);
  }
});

openAuth.addEventListener("click", () => authModal.classList.remove("hidden"));
closeAuth.addEventListener("click", () => authModal.classList.add("hidden"));
logoutBtn.addEventListener("click", async () => {
  try {
    await request("/auth/logout", { method: "POST" });
    currentUser = null;
    setAuthUI();
    showToast("Đã đăng xuất");
  } catch (error) {
    showToast(`Đăng xuất lỗi: ${error.message}`);
  }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  authStatus.textContent = "Đang đăng nhập...";
  try {
    await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: document.getElementById("loginUsername").value.trim(),
        password: document.getElementById("loginPassword").value,
      }),
    });
    authStatus.textContent = "Đăng nhập thành công";
    authModal.classList.add("hidden");
    await fetchMe();
    await loadServerCart();
  } catch (error) {
    authStatus.textContent = `Đăng nhập lỗi: ${error.message}`;
  }
});

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  authStatus.textContent = "Đang đăng ký...";
  try {
    await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: document.getElementById("registerUsername").value.trim(),
        email: document.getElementById("registerEmail").value.trim(),
        password: document.getElementById("registerPassword").value,
      }),
    });
    authStatus.textContent = "Đăng ký thành công. Mời đăng nhập.";
  } catch (error) {
    authStatus.textContent = `Đăng ký lỗi: ${error.message}`;
  }
});

[searchInput, categoryFilter, sortFilter].forEach((el) => {
  el.addEventListener("input", renderProducts);
  el.addEventListener("change", renderProducts);
});

productsGrid.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;
  try {
    await addToCart(btn.getAttribute("data-add"));
  } catch (error) {
    showToast(`Thêm giỏ hàng lỗi: ${error.message}`);
  }
});

cartItems.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-remove]");
  if (!btn) return;
  await removeCartItem(btn.getAttribute("data-remove"));
});

(async function init() {
  apiBaseInput.value = getApiBase();
  renderCart();
  await loadData();
  await fetchMe();
  if (currentUser) await loadServerCart();
})();
