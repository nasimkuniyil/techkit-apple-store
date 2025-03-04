const form = document.getElementById("loginForm");
const showPassword = document.getElementById("showPassword");
const forgotPassword = document.getElementById("forgotPassword");
const inputField = document.querySelectorAll(".form-group input");

//Form
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // document.querySelector('#email').value = 'nsblend999@gmail.com'
  // document.querySelector('#password').value = 10201020

  const validateResult = formValidate();

  if (validateResult) {
    showFlashMessage(validateResult);
    return;
  }

  const formData = Object.fromEntries(new FormData(form));
  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        window.location.href = "/";
      } else {
        showFlashMessage(data);
      }
    })
    .catch((error) => {
      // Handle network errors
      console.error("Network error:", error);
    });
});

// show / hide password
showPassword.addEventListener("click", function () {
  const passwordInput = document.getElementById("password");
  const showPasswordBtn = document.getElementById("showPassword");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    showPasswordBtn.textContent = "Hide";
  } else {
    passwordInput.type = "password";
    showPasswordBtn.textContent = "Show";
  }
});

//forgot password
forgotPassword.addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href = "/forgot-password";
});

//Form validation
function formValidate() {
  let returnVal;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const email = document.querySelector("#email").value;

  inputField.forEach((item) => {
    if (item.value == "") {
      validateInput(item, 'text')
      item.style.outline = "1px solid red";
      returnVal = { success: false, message: "Enter required field" };
    } else {
      item.style.outline = "";
    }
  });

  return returnVal;
}



function loginUser(){
  document.querySelector('#email').value = 'nsblend999@gmail.com'
  document.querySelector('#password').value = 505050
}