// ===========================
// ShopManager - main.js
// ===========================

// ---- Image Upload Preview ----
const uploadZone = document.getElementById("uploadZone");
const fileInput = document.getElementById("image");
const previewWrap = document.getElementById("uploadPreview");
const previewImg = document.getElementById("previewImg");
const placeholder = document.getElementById("uploadPlaceholder");

if (fileInput) {
  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
      alert("Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)!");
      this.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước ảnh không được vượt quá 5MB!");
      this.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewWrap.style.display = "block";
      placeholder.style.display = "none";
    };
    reader.readAsDataURL(file);
  });
}

// Drag & Drop
if (uploadZone) {
  uploadZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadZone.classList.add("dragover");
  });

  uploadZone.addEventListener("dragleave", () => {
    uploadZone.classList.remove("dragover");
  });

  uploadZone.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadZone.classList.remove("dragover");
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      fileInput.dispatchEvent(new Event("change"));
    }
  });
}

// Remove preview
function removePreview() {
  if (previewImg) previewImg.src = "";
  if (previewWrap) previewWrap.style.display = "none";
  if (placeholder) placeholder.style.display = "flex";
  if (fileInput) fileInput.value = "";
}

// ---- Delete Modal ----
function confirmDelete(id, name) {
  const modal = document.getElementById("deleteModal");
  const nameEl = document.getElementById("deleteProductName");
  const form = document.getElementById("deleteForm");

  if (modal && nameEl && form) {
    nameEl.textContent = name;
    form.action = "/products/" + id + "?_method=DELETE";
    modal.style.display = "flex";
  }
}

function closeModal() {
  const modal = document.getElementById("deleteModal");
  if (modal) modal.style.display = "none";
}

// Close modal on overlay click
document.addEventListener("click", (e) => {
  const modal = document.getElementById("deleteModal");
  if (modal && e.target === modal) closeModal();
});

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ---- Auto-dismiss alerts ----
setTimeout(() => {
  document.querySelectorAll(".alert").forEach((el) => {
    el.style.transition = "opacity 0.5s ease";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 500);
  });
}, 4000);

// ---- Price formatting hint ----
const priceInput = document.getElementById("price");
if (priceInput) {
  priceInput.addEventListener("input", function () {
    const val = parseFloat(this.value);
    if (!isNaN(val) && val >= 0) {
      this.title = val.toLocaleString("vi-VN") + " đồng";
    }
  });
}

// ---- Form loading state ----
document.querySelectorAll("form.product-form").forEach((form) => {
  form.addEventListener("submit", function () {
    const btn = this.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = "⏳ Đang xử lý...";
    }
  });
});
