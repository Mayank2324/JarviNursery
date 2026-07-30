// Enable/disable quantity inputs based on their checkbox
document.querySelectorAll(".variety-check").forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const targetInput = document.getElementById(checkbox.dataset.target);
    targetInput.disabled = !checkbox.checked;
    if (!checkbox.checked) targetInput.value = "";
  });
});

const form = document.getElementById("orderForm");
const submitBtn = document.getElementById("submitBtn");
const formMessage = document.getElementById("responseMessage");
// Restrict delivery date to today or future
const deliveryDateInput = document.getElementById("deliveryDate");

const today = new Date();
today.setHours(0, 0, 0, 0);

const minDate = today.toISOString().split("T")[0];
deliveryDateInput.min = minDate;

// Same-origin API base. If you host the frontend separately from the
// backend, replace this with the full backend URL, e.g.
// const API_BASE = "https://your-backend.onrender.com";
const API_BASE = "";

// Remember the button's original markup (emoji + translated label span)
// so the "Submitting..." state can be reverted without losing the
// current language's text.
const submitBtnOriginalHTML = submitBtn ? submitBtn.innerHTML : "";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formMessage.className = "response-message";
  formMessage.textContent = "";

  const payload = {
    farmerName: document.getElementById("farmerName").value.trim(),
    jarviRed: Number(document.getElementById("jarviRed").value || 0),
    jarviRed1: Number(document.getElementById("jarviRed1").value || 0),
    jarviRedPlus: Number(document.getElementById("jarviRedPlus").value || 0),
    jarviWhiteHoney: Number(document.getElementById("jarviWhiteHoney").value || 0),
    mobile: document.getElementById("mobile").value.trim(),
    fullAddress: document.getElementById("address").value.trim(),
    state: document.getElementById("state").value.trim(),
    village: document.getElementById("village").value.trim(),
    district: document.getElementById("district").value.trim(),
    pinCode: document.getElementById("pin").value.trim(),
    farmLocation: document.getElementById("farmLocation").value.trim(),
    deliveryDate: document.getElementById("deliveryDate").value
  };

  submitBtn.disabled = true;
  submitBtn.innerHTML = "Submitting...";

  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (res.ok && data.success) {
      formMessage.classList.add("success");
      formMessage.textContent = `Order placed! Your Order ID is ${data.uniqueId}. A confirmation SMS is on its way.`;
      form.reset();
      document.querySelectorAll('input[type="number"]').forEach((el) => (el.disabled = true));
      submitBtn.innerHTML = "Order Submitted";
      submitBtn.disabled = true;
    } else {
      formMessage.classList.add("error");
      formMessage.textContent = data.message || "Something went wrong. Please try again.";
    }
  } catch (err) {
    formMessage.classList.add("error");
    formMessage.textContent = "Could not reach the server. Please check your connection and try again.";
  } finally {
    if (!formMessage.classList.contains("success")) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtnOriginalHTML;
    }
}
});
form.addEventListener("input", () => {
    if (formMessage.classList.contains("success")) {
        formMessage.classList.remove("success");
        formMessage.textContent = "";

        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtnOriginalHTML;
    }
});