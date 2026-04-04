const API_BASE_STORAGE_KEY = "chieu_api_base";

const apiBaseInput = document.getElementById("apiBase");
const apiConfigModal = document.getElementById("apiConfigModal");
const toast = document.getElementById("toast");
const userBadge = document.getElementById("userBadge");
const openAuth = document.getElementById("openAuth");
const closeAuth = document.getElementById("closeAuth");
const authModal = document.getElementById("authModal");
const logoutBtn = document.getElementById("logoutBtn");
const authStatus = document.getElementById("authStatus");
const paymentsList = document.getElementById("paymentsList");
const statusFilter = document.getElementById("statusFilter");
const paymentDetailModal = document.getElementById("paymentDetailModal");
const createPaymentModal = document.getElementById("createPaymentModal");
const paymentDetail = document.getElementById("paymentDetail");

let currentUser = null;
let allPayments = [];
let selectedPaymentId = null;

const statusLabels = {
  pending: "Chờ xử lý",
  completed: "Hoàn thành",
  failed: "Thất bại",
  refunded: "Hoàn tiền",
};

const methodLabels = {
  credit_card: "Thẻ tín dụng",
  paypal: "PayPal",
  bank_transfer: "Chuyển khoản",
  cod: "Thanh toán khi nhận hàng",
};

function getApiBase() {
  return localStorage.getItem(API_BASE_STORAGE_KEY) || "http://localhost:3000/api/v1";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 1600);
}

function currency(value) {
  return Number(value || 0).toLocaleString("vi-VN") + " đ";
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

function renderPayments(payments = []) {
  if (!currentUser) {
    paymentsList.innerHTML = "<p class='empty'>Đăng nhập để xem lịch sử thanh toán.</p>";
    return;
  }
  if (!payments.length) {
    paymentsList.innerHTML = "<p class='empty'>Chưa có giao dịch nào.</p>";
    return;
  }
  paymentsList.innerHTML = payments
    .map(
      (p) => `
    <article class="payment-item" style="cursor: pointer;" data-id="${p._id}">
      <div>
        <strong>${currency(p.amount)}</strong>
        <div class="payment-meta">
          ${methodLabels[p.method] || p.method} · ${new Date(p.createdAt).toLocaleString("vi-VN")}
        </div>
      </div>
      <span class="status-pill status-${p.status}">${statusLabels[p.status] || p.status}</span>
    </article>
  `
    )
    .join("");
  
  // Add click handlers to payment items
  document.querySelectorAll(".payment-item").forEach((item) => {
    item.addEventListener("click", () => {
      const paymentId = item.getAttribute("data-id");
      showPaymentDetail(paymentId);
    });
  });
}

async function fetchMe() {
  try {
    currentUser = await request("/auth/me");
  } catch {
    currentUser = null;
  }
  setAuthUI();
}

async function loadPayments() {
  if (!currentUser) {
    renderPayments([]);
    return;
  }
  try {
    const data = await request("/payments");
    allPayments = Array.isArray(data) ? data : [];
    filterPayments();
  } catch (error) {
    showToast(`Không tải payment: ${error.message}`);
    renderPayments([]);
  }
}

function filterPayments() {
  const status = statusFilter.value;
  const filtered = status ? allPayments.filter((p) => p.status === status) : allPayments;
  renderPayments(filtered);
}

function showPaymentDetail(paymentId) {
  const payment = allPayments.find((p) => p._id === paymentId);
  if (!payment) {
    showToast("Không tìm thấy thanh toán");
    return;
  }
  
  selectedPaymentId = paymentId;
  document.getElementById("paymentStatusSelect").value = payment.status;
  
  paymentDetail.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div>
        <p><strong>Số tiền:</strong> ${currency(payment.amount)}</p>
        <p><strong>Phương thức:</strong> ${methodLabels[payment.method] || payment.method}</p>
        <p><strong>Trạng thái:</strong> ${statusLabels[payment.status] || payment.status}</p>
      </div>
      <div>
        <p><strong>Người dùng:</strong> ${payment.user?.username || payment.user?.email || "N/A"}</p>
        <p><strong>Tạo lúc:</strong> ${new Date(payment.createdAt).toLocaleString("vi-VN")}</p>
        <p><strong>Cập nhật lúc:</strong> ${new Date(payment.updatedAt).toLocaleString("vi-VN")}</p>
      </div>
    </div>
  `;
  
  paymentDetailModal.classList.remove("hidden");
}

async function updatePaymentStatus() {
  if (!selectedPaymentId) return;
  
  const newStatus = document.getElementById("paymentStatusSelect").value;
  const statusEl = document.getElementById("paymentDetailStatus");
  statusEl.textContent = "Đang cập nhật...";
  
  try {
    await request(`/payments/${selectedPaymentId}`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus }),
    });
    statusEl.textContent = "Cập nhật thành công";
    showToast("Cập nhật thanh toán thành công");
    await loadPayments();
    setTimeout(() => {
      paymentDetailModal.classList.add("hidden");
      showPaymentDetail(selectedPaymentId);
    }, 800);
  } catch (error) {
    statusEl.textContent = `Lỗi: ${error.message}`;
  }
}

async function deletePayment() {
  if (!selectedPaymentId || !confirm("Bạn chắc chắn muốn xóa thanh toán này?")) return;
  
  try {
    await request(`/payments/${selectedPaymentId}`, { method: "DELETE" });
    showToast("Xóa thanh toán thành công");
    paymentDetailModal.classList.add("hidden");
    await loadPayments();
  } catch (error) {
    showToast(`Lỗi xóa: ${error.message}`);
  }
}

async function createPayment() {
  const form = document.getElementById("createPaymentForm");
  const statusEl = document.getElementById("createPaymentStatus");
  
  const amount = Number(document.getElementById("paymentAmount").value);
  const method = document.getElementById("paymentMethod").value;
  const status = document.getElementById("paymentStatus").value;
  
  if (!amount || amount <= 0) {
    statusEl.textContent = "Vui lòng nhập số tiền hợp lệ";
    return;
  }
  
  if (!method) {
    statusEl.textContent = "Vui lòng chọn phương thức";
    return;
  }
  
  statusEl.textContent = "Đang tạo...";
  
  try {
    await request("/payments", {
      method: "POST",
      body: JSON.stringify({ amount, method, status }),
    });
    statusEl.textContent = "Tạo thanh toán thành công";
    showToast("Tạo thanh toán thành công");
    form.reset();
    await loadPayments();
    setTimeout(() => {
      createPaymentModal.classList.add("hidden");
    }, 800);
  } catch (error) {
    statusEl.textContent = `Lỗi: ${error.message}`;
  }
}

document.getElementById("openApiConfig").addEventListener("click", () => apiConfigModal.classList.remove("hidden"));
document.getElementById("closeApiConfig").addEventListener("click", () => apiConfigModal.classList.add("hidden"));
document.getElementById("saveApiBase").addEventListener("click", async () => {
  localStorage.setItem(API_BASE_STORAGE_KEY, apiBaseInput.value.trim());
  apiConfigModal.classList.add("hidden");
  showToast("Đã lưu API Base");
  await fetchMe();
  await loadPayments();
});

document.getElementById("refreshPayments").addEventListener("click", loadPayments);

document.getElementById("openCreatePayment").addEventListener("click", () => {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập trước");
    return;
  }
  createPaymentModal.classList.remove("hidden");
});

document.getElementById("closeCreatePayment").addEventListener("click", () => {
  createPaymentModal.classList.add("hidden");
});

document.getElementById("closePaymentDetail").addEventListener("click", () => {
  paymentDetailModal.classList.add("hidden");
});

document.getElementById("updatePaymentStatusBtn").addEventListener("click", updatePaymentStatus);
document.getElementById("deletePaymentBtn").addEventListener("click", deletePayment);

document.getElementById("createPaymentForm").addEventListener("submit", (e) => {
  e.preventDefault();
  createPayment();
});

statusFilter.addEventListener("change", filterPayments);

openAuth.addEventListener("click", () => authModal.classList.remove("hidden"));
closeAuth.addEventListener("click", () => authModal.classList.add("hidden"));

logoutBtn.addEventListener("click", async () => {
  try {
    await request("/auth/logout", { method: "POST" });
    currentUser = null;
    setAuthUI();
    renderPayments([]);
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
    await loadPayments();
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
    showToast("Tạo tài khoản thành công");
  } catch (error) {
    authStatus.textContent = `Đăng ký lỗi: ${error.message}`;
  }
});

(async function init() {
  apiBaseInput.value = getApiBase();
  await fetchMe();
  await loadPayments();
})();
