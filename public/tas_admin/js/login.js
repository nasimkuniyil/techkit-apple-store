const form = document.getElementById("loginForm");
const showPassword = document.getElementById("showPassword");
const forgotPassword = document.getElementById("forgotPassword");
const inputField = document.querySelectorAll(".form-group input");


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

//Form validation
function formValidate() {
  let returnVal;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const email = document.querySelector("#email").value;
  console.log("email valid : ", emailRegex.test(email));

  inputField.forEach((item) => {
    if (item.value == "") {
      item.style.outline = "1px solid red";
      returnVal = { success: false, message: "Enter required field" };
    } else {
      item.style.outline = "";
    }
  });

  return returnVal;
}
