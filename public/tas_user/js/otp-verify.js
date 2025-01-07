// OTP Input Handling
const otpInputs = document.querySelectorAll(".otp-input");

otpInputs.forEach((input, index) => {
  // Auto-focus next input
  input.addEventListener("input", (e) => {
    if (e.target.value !== "") {
      input.value = input.value.replace(/[^0-9]/g, "");
      const next = otpInputs[index + 1];
      if (next) next.focus();
    }
  });

  // Handle backspace
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !input.value) {
      const prev = otpInputs[index - 1];
      if (prev) {
        prev.focus();
        prev.value = "";
      }
    }
  });

  // Handle paste
  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");

    otpInputs.forEach((input, i) => {
      if (pastedData[i]) {
        input.value = pastedData[i];
        const next = otpInputs[i + 1];
        if (next) next.focus();
      }
    });
  });
});

// Timer Functionality
let timeLeft = 60; // 1 minutes in seconds
const timerDisplay = document.getElementById("time");
const resendBtn = document.getElementById("resendBtn");

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  if (timeLeft === 0) {
    clearInterval(timerInterval);
    resendBtn.disabled = false;
  } else {
    timeLeft--;
  }
}

let timerInterval = setInterval(updateTimer, 1000);

// Form Submission
document.getElementById("otpForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const otp = Array.from(otpInputs)
    .map((input) => input.value)
    .join("");

  const data = {
    ...localStorage,
    otp: parseInt(otp),
  };

  fetch("/otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      showFlashMessage(data);
      if (data.success) {
        localStorage.clear();
        window.location.href = "/";
      } else {
        console.log("Invalid or expired OTP. Please try again.");
      }
    })
    .catch((error) => console.error("Error verifying OTP:", error));

  console.log("Verifying OTP:", otp);
});

// Cancel Button
document.getElementById("cancelBtn").addEventListener("click", () => {
  // Add your cancel logic here
  window.location.href = "/login"; // or wherever you want to redirect
});

// Resend Button
resendBtn.addEventListener("click", () => {
  // Reset timer
  resendBtn.disabled = true;

  console.log("Resending OTP");

  fetch(`/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: localStorage.email }),
  })
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => {
      timeLeft = 60;
      timerInterval = setInterval(updateTimer, 1000);
      showFlashMessage(data);
      if (data.success) {
        window.location.href = `/otp/${localStorage.email}`; // Navigate to OTP page
      } else {
        // Handle error (for example, show an alert)
        console.error("Signup error:", data.message);
      }
    })
    .catch((error) => {
      // Catch any errors and log them
      console.error("Request failed:", error);
    });
});

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
