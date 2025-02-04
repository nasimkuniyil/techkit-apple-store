window.addEventListener("load", () => {
  if (localStorage.length > 0) {
    document.getElementById("firstname").value = localStorage.firstname;
    document.getElementById("lastname").value = localStorage.lastname;
    document.getElementById("email").value = localStorage.email;
    document.getElementById("mobile").value = localStorage.mobile;
  }
});

function togglePassword(inputId, buttonId) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);

  if (input.type === "password") {
    input.type = "text";
    button.textContent = "Hide";
  } else {
    input.type = "password";
    button.textContent = "Show";
  }
}

document.getElementById("showPassword").addEventListener("click", () => {
  togglePassword("password", "showPassword");
});

document.getElementById("showConfirmPassword").addEventListener("click", () => {
  togglePassword("confirmPassword", "showConfirmPassword");
});

document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const validateResult = formValidate();

  if (validateResult) {
    showFlashMessage(validateResult);
    return;
  }

  const formData = new FormData(this);
  const userData = [...formData.entries()];

  userData.forEach((data) => {
    localStorage.setItem(data[0], data[1]);
  });

  fetch(`/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: localStorage.email }),
  })
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => {
      showFlashMessage(data);
      if (data.success) {
        window.location.href = `/otp/${localStorage.email}`; // Navigate to OTP page
      } else {
        // Handle error (for example, show an alert)
        console.log("Signup error:", data.message);
      }
    })
    .catch((error) => {
      // Catch any errors and log them
      console.error("Request failed:", error);
    });
});

//FORM VALIDATION start
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

function formValidate() {
  let returnVal;

  document.querySelectorAll(".form-group input").forEach((item) => {
    if (item.value == "") {
      validateInput(item, 'text')
      item.style.outline = "1px solid red";
      returnVal = { success: false, message: "Enter required field" };
    } else {
      item.style.outline = "";
    }
  });

  if (returnVal !== undefined) return returnVal;

  if (password.value.length < 6) {
    returnVal = { success: false, message: "Password is too short" };
  }

  if (password.value.length > 15) {
    returnVal = { success: false, message: "Password is too long" };
  }

  if (returnVal !== undefined) return returnVal;

  if (password.value !== confirmPassword.value) {
    password.style.outline = "1px solid red";
    confirmPassword.style.outline = "1px solid red";
    returnVal = { success: false, message: "Password is not match" };
  }

  return returnVal;
}

// Check Password
password.addEventListener("input", (event) => {
  checkPassword(event.target.value); //calling check password function
});

function checkPassword(pswd) {
  const levels = {
    1: "red",
    2: "orange",
    3: "yellow",
    4: "green",
  };
  const checks = [/[a-z]/, /[A-Z]/, /[\d]/, /[@.#$!&*%^.?]/]; // 4 type regex
  let score = checks.reduce((acc, rgx) => acc + rgx.test(pswd), 0); // calculate password strength
  password.style.borderColor = `${levels[score]}`; // set border color as password strength levels
}

password.addEventListener(
  "focusout",
  (event) => (event.target.style.borderColor = "#d2d2d7")
); //change border to normal color

// FORM VALIDATION end

