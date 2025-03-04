// profile-show-script.js

// State management
let userData = {};

// DOM Elements
let editProfileBtn,
  editProfileModal,
  editProfileClose,
  editProfileCancel,
  editProfileForm;
let changePasswordBtn,
  changePasswordModal,
  changePasswordClose,
  changePasswordCancel,
  changePasswordForm;
let displayElements, formElements;

// Initialize DOM elements
function initializeDOM() {
  // Edit Profile Modal Elements
  editProfileBtn = document.getElementById("profile-show-edit-btn");
  editProfileModal = document.getElementById("edit-profile-modal");
  editProfileClose = document.getElementById("edit-profile-close");
  editProfileCancel = document.getElementById("edit-profile-cancel");
  editProfileForm = document.getElementById("edit-profile-form");

  // Change Password Modal Elements
  changePasswordBtn = document.getElementById("profile-show-change-password");
  changePasswordModal = document.getElementById("change-password-modal");
  changePasswordClose = document.getElementById("change-password-close");
  changePasswordCancel = document.getElementById("change-password-cancel");
  changePasswordForm = document.getElementById("change-password-form");

  // Display Elements
  displayElements = {
    profileAvatar: document.querySelector(".profile-avatar span"),
    firstName: document.getElementById("display-firstname"),
    lastName: document.getElementById("display-lastname"),
    email: document.getElementById("display-email"),
    mobile: document.getElementById("display-mobile"),
  };

  // Form Elements
  formElements = {
    firstName: document.getElementById("edit-firstname"),
    lastName: document.getElementById("edit-lastname"),
    email: document.getElementById("edit-email"),
    mobile: document.getElementById("edit-mobile"),
  };
}

// Event Listeners
function attachEventListeners() {
  // Edit Profile Modal Events
  editProfileBtn.addEventListener("click", openEditProfileModal);
  editProfileClose.addEventListener("click", closeEditProfileModal);
  editProfileCancel.addEventListener("click", closeEditProfileModal);
  editProfileForm.addEventListener("submit", handleProfileUpdate);

  // Change Password Modal Events
  changePasswordBtn.addEventListener("click", openChangePasswordModal);
  changePasswordClose.addEventListener("click", closeChangePasswordModal);
  changePasswordCancel.addEventListener("click", closeChangePasswordModal);
  changePasswordForm.addEventListener("submit", handlePasswordUpdate);

  // Close modals when clicking outside
  window.addEventListener("click", handleOutsideClick);
}

// Modal Management Functions
function openEditProfileModal() {
  initializeEditForm();
  editProfileModal.classList.add("active");
}

function closeEditProfileModal() {
  editProfileModal.classList.remove("active");
  editProfileForm.reset();
}

function openChangePasswordModal() {
  changePasswordModal.classList.add("active");
}

function closeChangePasswordModal() {
  changePasswordModal.classList.remove("active");
  changePasswordForm.reset();
}

function handleOutsideClick(event) {
  if (event.target === editProfileModal) {
    closeEditProfileModal();
  }
  if (event.target === changePasswordModal) {
    closeChangePasswordModal();
  }
}

// Form Management Functions
function initializeEditForm() {
  formElements.firstName.value = userData.firstName;
  formElements.lastName.value = userData.lastName;
  formElements.email.value = userData.email;
  formElements.mobile.value = userData.mobile;
}

function updateDisplayValues() {
  displayElements.profileAvatar.textContent = userData.profileAvatar;
  displayElements.firstName.textContent = userData.firstName;
  displayElements.lastName.textContent = userData.lastName;
  displayElements.email.textContent = userData.email;
  displayElements.mobile.textContent = userData.mobile;
}

// Form Submission Handlers
function handleProfileUpdate(event) {
  event.preventDefault();

  const updatedUserData = {
    firstName: formElements.firstName.value,
    lastName: formElements.lastName.value,
    mobile: formElements.mobile.value,
  };

  console.log("form element : ", formElements);

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedUserData),
  };

  fetch("/api/edit-profile", options).then(response => window.location.href = response.url).catch(err=>console.log(err.message));

  // Update display
  updateDisplayValues();

  // Show success message
  showNotification("Profile updated successfully!");

  // Close modal
  closeEditProfileModal();
}

function handlePasswordUpdate(event) {
  event.preventDefault();

  const currentPassword = document.getElementById("current-password").value;
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Validate passwords
  if (newPassword !== confirmPassword) {
    showNotification("New passwords do not match!", "error");
    return;
  }

  console.log("Password update request:", { currentPassword, newPassword });

  const url = '/api/change-password'

  const options={
    method:'PUT',
    headers:{
      'Content-Type' : 'application/json'
    },
    body:JSON.stringify({currentPassword,newPassword})
  }

  fetch(url, options)
  .then((response)=> {
    if(response.ok) closeChangePasswordModal();
  })
  .catch(err => console.log('change password error : ', err))

  // Show success message
  showNotification("Password updated successfully!");
}

// Utility Functions
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `profile-show-notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// API Functions
async function fetchUserData() {
  try {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(userData), 500);
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    showNotification("Failed to load user data", "error");
  }
}

async function updateUserData(data) {
  try {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    showNotification("Failed to update profile", "error");
  }
}

async function updatePassword(passwords) {
  try {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  } catch (error) {
    console.error("Error updating password:", error);
    showNotification("Failed to update password", "error");
  }
}

// Initialize everything when the DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  await fetch("/api/profile")
    .then((response) => response.json())
    .then((data) => {
      userData.profileAvatar = data.profileAvatar;
      userData.firstName = data.userData.firstname;
      userData.lastName = data.userData.lastname;
      userData.email = data.userData.email;
      userData.mobile = data.userData.mobile;
    });

  initializeDOM();
  attachEventListeners();
  updateDisplayValues();
});
