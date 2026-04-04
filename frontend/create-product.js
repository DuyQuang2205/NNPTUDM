const API_BASE_STORAGE_KEY = "chieu_api_base";

const apiBaseInput = document.getElementById("apiBase");
const apiConfigModal = document.getElementById("apiConfigModal");
const toast = document.getElementById("toast");
const createProductForm = document.getElementById("createProductForm");
const newCategorySelect = document.getElementById("newCategory");
const createProductStatus = document.getElementById("createProductStatus");
const newCategoryNameInput = document.getElementById("newCategoryName");
const createCategoryBtn = document.getElementById("createCategoryBtn");
const categoryStatus = document.getElementById("categoryStatus");

function getApiBase() {
  return localStorage.getItem(API_BASE_STORAGE_KEY) || "http://localhost:3000/api/v1";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 1600);
}

function toSku(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

async function request(path, options = {}) {
  const res = await fetch(`${getApiBase()}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
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

async function loadCategories() {
  try {
    const categories = await request("/categories");
    const safeCategories = Array.isArray(categories) ? categories : [];

    if (!safeCategories.length) {
      newCategorySelect.innerHTML = `<option value="">Chưa có danh mục nào</option>`;
      categoryStatus.textContent = "Hiện chưa có danh mục trong database. Hãy tạo mới ở ô bên trên.";
      return;
    }

    newCategorySelect.innerHTML = `<option value="">Chọn danh mục</option>${safeCategories
      .map((c) => `<option value="${c.name}">${c.name}</option>`)
      .join("")}`;
    categoryStatus.textContent = "";
  } catch (error) {
    newCategorySelect.innerHTML = `<option value="">Không tải được danh mục</option>`;
    categoryStatus.textContent = `Lỗi tải danh mục: ${error.message}`;
  }
}

document.getElementById("openApiConfig").addEventListener("click", () => apiConfigModal.classList.remove("hidden"));
document.getElementById("closeApiConfig").addEventListener("click", () => apiConfigModal.classList.add("hidden"));
document.getElementById("saveApiBase").addEventListener("click", async () => {
  localStorage.setItem(API_BASE_STORAGE_KEY, apiBaseInput.value.trim());
  apiConfigModal.classList.add("hidden");
  showToast("Đã lưu API Base");
  await loadCategories();
});

createProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("newTitle").value.trim();
  const price = Number(document.getElementById("newPrice").value || 0);
  const category = newCategorySelect.value;
  const description = document.getElementById("newDescription").value.trim();
  const images = document.getElementById("newImages").value.split(",").map((x) => x.trim()).filter(Boolean);
  const skuInput = document.getElementById("newSku").value.trim();
  const sku = skuInput || `${toSku(title) || "product"}-${Date.now().toString().slice(-6)}`;

  createProductStatus.textContent = "Đang thêm sản phẩm...";
  try {
    await request("/products", {
      method: "POST",
      body: JSON.stringify({ title, sku, price, category, description, images }),
    });
    createProductStatus.textContent = "Thêm sản phẩm thành công";
    createProductForm.reset();
    showToast("Đã thêm sản phẩm mới");
  } catch (error) {
    createProductStatus.textContent = `Lỗi: ${error.message}`;
    showToast("Thêm sản phẩm thất bại");
  }
});

createCategoryBtn.addEventListener("click", async () => {
  const name = newCategoryNameInput.value.trim();
  if (!name) {
    categoryStatus.textContent = "Nhập tên danh mục trước khi tạo.";
    return;
  }

  categoryStatus.textContent = "Đang tạo danh mục...";
  try {
    await request("/categories", {
      method: "POST",
      body: JSON.stringify({
        name,
        description: "Tạo từ giao diện thêm sản phẩm",
      }),
    });
    newCategoryNameInput.value = "";
    categoryStatus.textContent = "Tạo danh mục thành công.";
    showToast("Đã tạo danh mục");
    await loadCategories();
  } catch (error) {
    categoryStatus.textContent = `Tạo danh mục lỗi: ${error.message}`;
    showToast("Tạo danh mục thất bại");
  }
});

(async function init() {
  apiBaseInput.value = getApiBase();
  await loadCategories();
})();
