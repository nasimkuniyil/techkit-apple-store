const emailForm = document.querySelector("#emailForm");
const email = document.querySelector("#email");
const emailSubmitBtn = document.querySelector("#emailSubmitBtn");

const otpForm = document.querySelector("#otpForm");
const otpTimer = document.querySelector("#timer");
const otp = document.querySelector("#otp");
const otpSubmitBtn = document.querySelector("#otpSubmitBtn");

// const changePasswordBtn = document.getElementById("profile-show-change-password");
const changePasswordModal = document.getElementById("change-password-modal");
const changePasswordClose = document.getElementById("change-password-close");
const changePasswordCancel = document.getElementById("change-password-cancel");
const updatePasswordBtn = document.querySelector(".profile-show-btn-primary");

let timerInterval;

initialize();
attachEventListeners();
sendOTP();
verifyOTP();

function initialize() {
  otpTimer.classList.add("hide");
  otp.setAttribute("disabled", true);
  otpSubmitBtn.setAttribute("disabled", true);
}

function emailValidation() {
  if (!email.value.trim()) {
    return true;
  }
}

function sendOTP() {
  emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const validateEmail = emailValidation();
    if (validateEmail) {
      showFlashMessage({ success: false, message: "Enter email" });
      return false;
    }

    otpForm.classList.add("show");
    emailSubmitBtn.setAttribute("disabled", true);
    email.setAttribute("disabled", true);
    emailSubmitBtn.textContent = "Submiting...";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.value }),
    };

    try {
      const response = await fetch("/api/send-otp", options);
      const data = await response.json();
      console.log("data : ", data);
      if (!response.ok) {
        throw new Error(data.message);
      }

      showFlashMessage(data);
      emailSubmitBtn.textContent = "Done";
      otpTimer.classList.remove("hide");
      otp.removeAttribute("disabled");
      otpSubmitBtn.removeAttribute("disabled");
      startTimer();

    } catch (err) {
      console.log("errr : ", err);
      showFlashMessage({success:false, message:err.message});
      emailSubmitBtn.textContent = "Try again";
      emailSubmitBtn.removeAttribute("disabled");
      email.removeAttribute("disabled");
    }
  });
}

// OTP VERIFICATION
function verifyOTP() {
  otpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // otpSubmitBtn

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.value, otp: otp.value }),
    };

    fetch("/api/verify-otp", options)
      .then((response) => {
        if (!response.ok) {
          return response.json();
        }
        return { success: true, message: "Verification success" };
      })
      .then((data) => {
        console.log(data);
        showFlashMessage(data);
        if (data.success) {
          clearInterval(timerInterval);
          openChangePasswordModal();
        }
      })
      .catch((err) => {
        showFlashMessage({ success: false, message: err.message });
      });
  });
}

// Timer Functionality
function startTimer() {
  let timeLeft = 60; // 1 minutes in seconds
  const timerDisplay = document.getElementById("time");

  function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;

    if (timeLeft === 0) {
      clearInterval(timerInterval);
      otpFormReset();

      initialize();
    } else {
      timeLeft--;
    }
  }

  timerInterval = setInterval(updateTimer, 1000);
}

function otpFormReset() {
  otpForm.classList.remove("show");
  otp.value = "";
  emailSubmitBtn.textContent = "Resend OTP";
  emailSubmitBtn.removeAttribute("disabled");
  email.removeAttribute("disabled");
}

// --- CHANGE PASSWORD MODAL SCRIPT ---//

// Event Listeners for modal actions
function attachEventListeners() {
  changePasswordClose.addEventListener("click", closeChangePasswordModal);
  changePasswordCancel.addEventListener("click", closeChangePasswordModal);
  updatePasswordBtn.addEventListener("click", handlePasswordUpdate);

  // Close modals when clicking outside
  window.addEventListener("click", handleOutsideClick);
}

// Modal management functions
function openChangePasswordModal() {
  changePasswordModal.classList.add("active");
}

function closeChangePasswordModal() {
  changePasswordModal.classList.remove("active");
  otpFormReset();
}

function handleOutsideClick(event) {
  if (event.target === changePasswordModal) {
    closeChangePasswordModal();
  }
}

// Handle password update form submission
function handlePasswordUpdate(event) {
  event.preventDefault();

  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Validate password match
  if (newPassword !== confirmPassword) {
    showNotification("New passwords do not match!", "error");
    return;
  }

  // Send password update request
  const url = `/api/forgot-change-password?email=${email.value}`;
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPassword, otp: otp.value }),
  };

  fetch(url, options)
    .then((response) => {
      if (response.ok) {
        closeChangePasswordModal();
        otpFormReset();
        window.location.href = "/";
      }
    })
    .catch((err) => {
      console.log("Password update error:", err);
      showFlashMessage({
        success: false,
        message: "Failed to update password, Error!",
      });
    });
}

// UTILITIES

// Utility function to show notifications
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `profile-show-notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
