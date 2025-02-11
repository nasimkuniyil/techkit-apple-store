function validateForm(event) {
  event.preventDefault();
  let isValid = true;

  // Reset errors
  document
    .querySelectorAll(".error")
    .forEach((error) => (error.style.display = "none"));

  // Validate offer title
  const title = document.getElementById("offerTitle").value;
  if (!title) {
    document.getElementById("offerTitleError").textContent =
      "Enter offer title";
    document.getElementById("offerTitleError").style.display = "block";
    isValid = false;
  }

  // Validate discount value (in percentage)
  const discountValue = parseFloat(document.getElementById("discountValue").value);
  if (!discountValue) {
    document.getElementById("valueError").textContent = "Add discount value";
    document.getElementById("valueError").style.display = "block";
    isValid = false;
  }else if (discountValue < 1 || discountValue > 90) {
    document.getElementById("valueError").textContent = "Percentage discount must be between 1 and 90";
    document.getElementById("valueError").style.display = "block";
    isValid = false;
  }

  // Validate offer target id
  const targetId = document.getElementById("targetId").value;
  if (targetId == "") {
    document.getElementById("targetIdError").textContent =
      "Select item";
    document.getElementById("targetIdError").style.display = "block";
    isValid = false;
  }


  // Validate end date date
  const endDate = new Date(document.getElementById("endDate").value);
  if (isNaN(endDate)) {
    document.getElementById("endDateError").textContent = "Select date";
    document.getElementById("endDateError").style.display = "block";
    isValid = false;
  } else if (endDate <= new Date()) {
    document.getElementById("endDateError").textContent = "Expiration date must be in the future";
    document.getElementById("endDateError").style.display = "block";
    isValid = false;
  }

  if (isValid) {
    // Here you would typically submit the form to your backend
    const type = window.location.href.toString().split("/").pop();
    console.log("HELLO WORLD");
    const url = `/admin/api/offer/add/${type}`;
    const data = { title, type, targetId, discountValue, endDate}

    axios.post(url, data)
      .then(response => {
        console.log('response : ', response)
        showFlashMessage(response.data)
        window.location.href = '/admin/offers'
      })
      .catch((err) => {
        showFlashMessage(err.response.data)
        console.error("error message : ", err)
      });
  }
}

// Set minimum date for expiration field to tomorrow
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
document.getElementById("endDate").min = tomorrow
  .toISOString()
  .slice(0, 16);
