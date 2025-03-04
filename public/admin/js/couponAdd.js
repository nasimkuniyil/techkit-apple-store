function validateForm(event) {
  event.preventDefault();
  let isValid = true;

  // Reset errors
  document
    .querySelectorAll(".error")
    .forEach((error) => (error.style.display = "none"));

  // Validate coupon code
  const code = document.getElementById("couponCode").value;
  if (!/^[A-Z0-9_-]{4,16}$/.test(code)) {
    document.getElementById("codeError").textContent =
      "Coupon code must be 4-16 characters long and contain only uppercase letters, numbers, underscores, or hyphens";
    document.getElementById("codeError").style.display = "block";
    isValid = false;
  }

  // Validate discount value
  const value = parseFloat(document.getElementById("discountValue").value);
  if (value < 1 || value > 500) {
    document.getElementById("valueError").textContent =
      "Discount price must be between 1 and 500";
    document.getElementById("valueError").style.display = "block";
    isValid = false;
  }

  // Validate expiration date
  const expDate = new Date(document.getElementById("expirationDate").value);
  if (expDate <= new Date()) {
    document.getElementById("dateError").textContent =
      "Expiration date must be in the future";
    document.getElementById("dateError").style.display = "block";
    isValid = false;
  }

  // Validate usage limit
  const limit = parseInt(document.getElementById("usageLimit").value);
  if (limit < 1) {
    document.getElementById("limitError").textContent =
      "Usage limit must be at least 1";
    document.getElementById("limitError").style.display = "block";
    isValid = false;
  }
  
  const minimumPurchase = parseInt(document.getElementById('minPurchase').value);
  if(minimumPurchase < 200){
    document.getElementById("minPurchaseError").textContent =
      "Usage minimum purchase must be at least 200.";
    document.getElementById("minPurchaseError").style.display = "block";
    isValid = false;
    
  }

  if (isValid) {
    const url = "/admin/api/coupon/add";
    const data = { code, value, expDate, limit, minimumPurchase}

    axios.post(url, data)
      .then(response => {
        showFlashMessage(response.data)
        // window.location.href = '/admin/coupons'
      })
      .catch((err) => {
        console.error("error message : ", err)
        showFlashMessage(err.response.data)

      });
  }
}

// Set minimum date for expiration field to tomorrow
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
document.getElementById("expirationDate").min = tomorrow
  .toISOString()
  .slice(0, 16);
