// script.js - مدیریت پیشرفت، وضعیت تجهیزات، و تحقق هویت اپراتورها
(function () {
  // پایگاه دادهٔ نمونهٔ اپراتورها (شبیه‌سازی)
  const operatorsDatabase = [
    "احمد علی",
    "فاطمه رضایی",
    "محمد حسین",
    "مریم کریمی",
    "علی اکبری",
    "زهرا نصری",
    "سارا دهقانی",
    "جواد ملکی",
    "نیلوفر صادقی",
    "کامران رحیمی",
  ];

  const equipGrid = document.getElementById("equipment-grid");
  const equipProgress = document.getElementById("equip-progress");
  const transferFromInput = document.getElementById("transfer-from");
  const transferToInput = document.getElementById("transfer-to");
  const transferFromError = document.getElementById("transfer-from-error");
  const transferToError = document.getElementById("transfer-to-error");
  const staffSection = document.getElementById("staff-section");
  const equipmentSection = document.getElementById("equipment-section");
  const incidentsSection = document.getElementById("incidents-section");

  function updateEquipmentProgress() {
    const cards = Array.from(equipGrid.querySelectorAll(".equipment-card"));
    const total = cards.length;
    let okCount = 0;
    cards.forEach((card) => {
      const name = card.dataset.equip;
      const checked = card.querySelector("input[type=radio]:checked");
      if (checked && checked.value === "ok") okCount++;
    });
    const percent = total ? Math.round((okCount / total) * 100) : 0;
    equipProgress.style.width = percent + "%";
    equipProgress.textContent = percent + "%";
  }

  function isOperatorValid(name) {
    const trimmed = name.trim();
    return operatorsDatabase.some(
      (op) => op.toLowerCase() === trimmed.toLowerCase()
    );
  }

  // اعتبارسنجی فیلدها (فقط بازخورد بصری) — تا زمانی که کاربر روی «ثبت» کلیک نکند، بخش‌ها نمایش داده نمی‌شوند
  function validateTransferInputs() {
    const fromValue = transferFromInput.value.trim();
    const toValue = transferToInput.value.trim();

    let fromValid = false;
    let toValid = false;

    // Validate "transfer-from" field: just set visual feedback
    if (fromValue.length === 0) {
      transferFromError.textContent = "";
      transferFromInput.classList.remove("input-error", "input-success");
    } else if (!isOperatorValid(fromValue)) {
      transferFromError.textContent = "";
      transferFromInput.classList.add("input-error");
      transferFromInput.classList.remove("input-success");
    } else {
      transferFromError.textContent = "";
      transferFromInput.classList.add("input-success");
      transferFromInput.classList.remove("input-error");
      fromValid = true;
    }

    // Validate "transfer-to" field: just set visual feedback
    if (toValue.length === 0) {
      transferToError.textContent = "";
      transferToInput.classList.remove("input-error", "input-success");
    } else if (!isOperatorValid(toValue)) {
      transferToError.textContent = "";
      transferToInput.classList.add("input-error");
      transferToInput.classList.remove("input-success");
    } else {
      transferToError.textContent = "";
      transferToInput.classList.add("input-success");
      transferToInput.classList.remove("input-error");
      toValid = true;
    }

    return { fromValid, toValid };
  }

  // وقتی کاربر روی دکمهٔ «ثبت» کلیک می‌کند: بررسی قطعی انجام می‌شود و در صورت صحت یا خطا، رفتار مناسب انجام می‌شود
  const verifyBtn = document.getElementById("transfer-verify");
  const transferGeneralError = document.getElementById(
    "transfer-general-error"
  );

  // تابع‌های کمکی مودال (پاپ‌آپ مرکزی)
  function showModal(msg) {
    const modal = document.getElementById("global-modal");
    const msgNode = document.getElementById("global-modal-message");
    if (!modal || !msgNode) return;
    msgNode.textContent = msg;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    // فوکوس برای دسترس‌پذیری
    const closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function hideModal() {
    const modal = document.getElementById("global-modal");
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  //   بستن مودال (با کلیک دکمهٔ بستن)
  document.addEventListener("click", function (e) {
    const modal = document.getElementById("global-modal");
    if (!modal) return;
    if (
      e.target.matches(".modal-close") ||
      e.target.matches(".modal-backdrop")
    ) {
      hideModal();
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hideModal();
  });

  function handleVerifyClick() {
    transferGeneralError.textContent = "";
    const fromValue = transferFromInput.value.trim();
    const toValue = transferToInput.value.trim();

    let ok = true;

    // بررسی فیلد "تحویل‌دهنده"
    if (!fromValue || !isOperatorValid(fromValue)) {
      transferFromError.textContent = "این نام برای شیفت امروز ثبت نشده است";
      transferFromInput.classList.add("input-error");
      transferFromInput.classList.remove("input-success");
      ok = false;
    } else {
      transferFromError.textContent = "";
      transferFromInput.classList.remove("input-error");
      transferFromInput.classList.add("input-success");
    }

    // بررسی فیلد "تحویل‌گیرنده"
    if (!toValue || !isOperatorValid(toValue)) {
      transferToError.textContent = "این نام برای شیفت امروز ثبت نشده است";
      transferToInput.classList.add("input-error");
      transferToInput.classList.remove("input-success");
      ok = false;
    } else {
      transferToError.textContent = "";
      transferToInput.classList.remove("input-error");
      transferToInput.classList.add("input-success");
    }

    if (ok) {
      // reveal sections
      staffSection.classList.add("enabled");
      equipmentSection.classList.add("enabled");
      incidentsSection.classList.add("enabled");
      transferGeneralError.textContent = "";
    } else {
      // فوکوس روی اولین فیلد نامعتبر
      if (!isOperatorValid(fromValue)) {
        transferFromInput.focus();
      } else if (!isOperatorValid(toValue)) {
        transferToInput.focus();
      }
      // نگه داشتن بخش‌ها در حالت پنهان
      staffSection.classList.remove("enabled");
      equipmentSection.classList.remove("enabled");
      incidentsSection.classList.remove("enabled");
      // نمایش مودال برای پیام کلی خطا
      showModal("لطفاً نام‌های معتبر را وارد کنید");
    }
  }

  // افزودن شنونده‌ها برای فیلدهای تحویل جهت نمایش بازخورد فوری (ولی نه بررسی قطعی)
  transferFromInput.addEventListener("input", function () {
    // clear general error when editing
    const fromValue = transferFromInput.value.trim();
    transferGeneralError.textContent = "";
    if (!fromValue) {
      transferFromError.textContent = "";
      transferFromInput.classList.remove("input-error", "input-success");
    } else if (isOperatorValid(fromValue)) {
      transferFromError.textContent = "";
      transferFromInput.classList.add("input-success");
      transferFromInput.classList.remove("input-error");
    } else {
      transferFromError.textContent = "";
      transferFromInput.classList.add("input-error");
      transferFromInput.classList.remove("input-success");
    }
  });

  transferToInput.addEventListener("input", function () {
    const toValue = transferToInput.value.trim();
    transferGeneralError.textContent = "";
    if (!toValue) {
      transferToError.textContent = "";
      transferToInput.classList.remove("input-error", "input-success");
    } else if (isOperatorValid(toValue)) {
      transferToError.textContent = "";
      transferToInput.classList.add("input-success");
      transferToInput.classList.remove("input-error");
    } else {
      transferToError.textContent = "";
      transferToInput.classList.add("input-error");
      transferToInput.classList.remove("input-success");
    }
  });

  verifyBtn.addEventListener("click", handleVerifyClick);
  // اجازهٔ ارسال با Enter هنگام فوکوس روی فیلدها
  [transferFromInput, transferToInput].forEach((el) =>
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleVerifyClick();
      }
    })
  );

  // افزودن شنونده برای تغییر وضعیت تجهیزات (به‌روزرسانی پیشرفت)
  equipGrid.addEventListener("change", function (e) {
    if (e.target && e.target.matches("input[type=radio]")) {
      updateEquipmentProgress();
    }
  });

  // اعتبارسنجی اولیهٔ فرم
  validateTransferInputs();
  updateEquipmentProgress();

  // اختیاری: افشای آرایهٔ اپراتورها برای دیباگ و بررسی
  window.operatorsDatabase = operatorsDatabase;
})();
