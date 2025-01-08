// Image Gallery and Zoom Functionality
document.addEventListener("DOMContentLoaded", function () {
  const mainImage = document.getElementById("mainImage");
  const zoomPane = document.getElementById("zoomPane");
  const thumbnails = document.querySelectorAll(".thumbnail");

  // Zoom functionality
  function handleZoom(e) {
    const zoomer = e.currentTarget;
    const offsetX = e.offsetX;
    const offsetY = e.offsetY;
    const x = (offsetX / zoomer.offsetWidth) * 100;
    const y = (offsetY / zoomer.offsetHeight) * 100;

    zoomPane.style.backgroundImage = `url(${mainImage.src})`;
    zoomPane.style.backgroundPosition = `${x}% ${y}%`;
    zoomPane.style.backgroundSize = "250%";
    zoomPane.style.display = "block";
  }

  // Add zoom events
  mainImage.parentElement.addEventListener("mousemove", handleZoom);
  mainImage.parentElement.addEventListener("mouseleave", () => {
    zoomPane.style.display = "none";
  });

  // Thumbnail click handling
  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      thumbnails.forEach((t) => t.classList.remove("active"));
      thumbnail.classList.add("active");
      mainImage.src = thumbnail.querySelector("img").dataset.src;
    });
  });
});

// Color Selection
const colorOptions = document.querySelectorAll(".color-option");
colorOptions.forEach((option) => {
  option.addEventListener("click", () => {
    colorOptions.forEach((o) => o.classList.remove("active"));
    option.classList.add("active");
  });
});

// Quantity Management
let quantity = 1;
let maxStock = 5;
const quantityDisplay = document.getElementById("quantity");
const stockStatus = document.getElementById("stockStatus");

function updateQuantity({ change, prodQuantity }) {
  const newQuantity = quantity + change;
  maxStock = maxStock >= prodQuantity ? prodQuantity : maxStock;
  if (newQuantity >= 1 && newQuantity <= maxStock) {
    quantity = newQuantity;
    quantityDisplay.textContent = quantity;
    updateStockStatus();
  }
}

function updateStockStatus() {
  if (quantity >= maxStock) {
    stockStatus.textContent = "Added maximum";
    stockStatus.style.color = "#e74c3c";
  } else {
    stockStatus.textContent = "";
  }
}

// Cart and Wishlist Functions
function addToCart(id) {
  const url = window.location.origin + "/add-cart";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId: id, quantity }),
  };

  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.message); // Handle errors from the server
        });
      }
      window.location.href = response.url;
      // return response.json();
    })
    .catch((error) => {
      const text = `${error}`;
      alert(text)
    });
}

function addToWishlist() {
  const wishlistBtn = document.querySelector(".add-to-wishlist i");
  wishlistBtn.classList.toggle("far");
  wishlistBtn.classList.toggle("fas");
  alert("Added to your wishlist");
  // Here you would typically make an API call to add to wishlist
}

// Review System
let userRating = 0;

// Star rating handling
const starRatingInput = document.querySelectorAll(".star-rating input");
const starRatingLabel = document.querySelectorAll(".star-rating label");
starRatingInput.forEach((input) => {
  input.addEventListener("change", (e) => {
    userRating = e.target.value;
    console.log(userRating);
    removeStarFill();
    starRatingLabel.forEach((item, index) => {
      if (userRating > index) {
        item.classList.add("star-fill");
      }
    });
  });
});

function removeStarFill() {
  starRatingLabel.forEach((item) => item.classList.remove("star-fill"));
}

function submitReview(event) {
  event.preventDefault();
  console.log(userRating);
  const reviewText = event.target.querySelector("textarea").value;

  if (userRating === 0) {
    alert("Please select a rating");
    return;
  }

  // Create new review element
  const reviewList = document.querySelector(".review-list");
  const newReview = document.createElement("div");
  newReview.classList.add("review-item");

  // Add review content
  newReview.innerHTML = `
        <div class="rating">
            ${Array(5)
              .fill()
              .map(
                (_, i) =>
                  `<i class="${i < userRating ? "fas" : "far"} fa-star"></i>`
              )
              .join(" ")}
        </div>
        <p>${reviewText}</p>
        <small style="color: #86868b;">You - Just now</small>
    `;

  // Add to review list
  reviewList.insertBefore(newReview, reviewList.firstChild);

  // Reset form
  event.target.reset();
  userRating = 0;
  removeStarFill();
}
