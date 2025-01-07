const form = document.getElementById("loginForm");
const showPassword = document.getElementById("showPassword");
const forgotPassword = document.getElementById("forgotPassword");
const inputField = document.querySelectorAll(".form-group input");

//Form
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const validateResult = formValidate();

  if (validateResult) {
    showFlashMessage(validateResult);
    return;
  }

  const formData = Object.fromEntries(new FormData(form));
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Handle success (e.g., redirect to home page)
        console.log("Logged in successfully:", data.message);
        window.location.href = "/";
      } else {
        showFlashMessage(data);
        console.log(data);
      }
    })
    .catch((error) => {
      // Handle network errors
      console.error("Network error:", error);
      alert("An unexpected error occurred. Please try again.");
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
  window.location.href = "/reset-password";
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

//--- FLASH MESSAGE ---
function showFlashMessage({ success, message }) {
  const notification = document.getElementById("notification");

  const messagePopup = document.createElement("div");

  messagePopup.id = "popup-message";
  messagePopup.className = "";
  messagePopup.classList.add(success ? "success" : "failed");
  messagePopup.textContent = message;
  notification.appendChild(messagePopup);
  removeElem(messagePopup);
}

function removeElem(div) {
  let timeout;
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    div.classList.add("hide");
    setTimeout(() => {
      clearTimeout(timeout);
      div.remove();
    }, 500);
  }, 2500);
}
