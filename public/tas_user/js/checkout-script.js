// DOM Elements
const addressModal = document.getElementById("addressModal");
const orderConfirmModal = document.getElementById("orderConfirmModal");
const addAddressBtn = document.getElementById("addAddressBtn");
const cancelAddressBtn = document.getElementById("cancelAddress");
const addressForm = document.getElementById("addressForm");
const addressList = document.getElementById("addressList");
const placeOrderBtn = document.getElementById("placeOrderBtn");

// Sample addresses (Replace with your data storage solution)
let addresses = [];

let porductDetails = [];

let selectedAddressId = null;
let totalAmount = 0;

// Initial load
fetchAddresses();
fetchCartData();

// Fetch addresses from API
async function fetchAddresses() {
  try {
    const response = await fetch("/api/address");
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    const updatedAdd = data.address.map((add) => {
      const { _id } = add;
      let id = _id.toString();
      return { ...add, _id: id };
    });
    addresses = updatedAdd || [];
    renderAddresses();

    // Select first address if available
    if (addresses.length > 0) {
      selectedAddressId = addresses[0]._id;
      updateSelectedAddress();
    }
  } catch (error) {
    showFlashMessage({ success: false, message: error.message });
  }
}

// fetch Cart Data
async function fetchCartData() {
  const url = "/api/cart";

  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }

    const data = await response.json();
    if (data.cartProducts) {
      console.log("data:", data.cartProducts);
      porductDetails.push(...data.cartProducts);
      createCartItem(data.cartProducts);
    }
  } catch (err) {
    console.error("Error fetching cart:", err);
    alert("An error occurred while fetching the cart");
  }
}

// Event Listeners
addAddressBtn.addEventListener("click", () => {
  addressModal.classList.add("active");
});

cancelAddressBtn.addEventListener("click", () => {
  addressModal.classList.remove("active");
  addressForm.reset();
});

// Handle address form submission
addressForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newAddress = {
    name: document.getElementById("name").value,
    mobile: document.getElementById("mobile").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    country: document.getElementById("country").value,
    pincode: document.getElementById("pincode").value,
    landmark: document.getElementById("landmark").value,
  };

  try {
    // add API call here to save address
    const response = await fetch("/api/add-address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAddress),
    });

    addresses.push(newAddress);
    renderAddresses();

    addressModal.classList.remove("active");
    addressForm.reset();

    selectedAddressId = newAddress._id;
    updateSelectedAddress();

    showFlashMessage({ success: true, message: "Address added successfully!" });
  } catch (error) {
    showFlashMessage({ success: false, message: error.message });
  }
});

// Close modals if clicking outside
window.addEventListener("click", (e) => {
  if (e.target === addressModal) {
    addressModal.classList.remove("active");
    addressForm.reset();
  }
  if (e.target === orderConfirmModal) {
    orderConfirmModal.classList.remove("active");
  }
});

// Render addresses
function renderAddresses() {
  addressList.innerHTML = addresses
    .map(
      (address) => `
          <div class="address-card" data-id="${address._id}" onclick="selectAddress('${address._id}')">
              <strong>${address.name}</strong><br>
              ${address.address}<br>
              ${address.city}, ${address.state} ${address.pincode}<br>
              ${address.country}<br>
              ${address.landmark}<br>
              ${address.mobile}
              <div class="address-actions">
                  <button onclick="editAddress('${address._id}', event)" class="checkout-btn-secondary">Edit</button>
                  <button onclick="deleteAddress('${address._id}', event)" class="checkout-btn-secondary">Delete</button>
              </div>
          </div>
      `
    )
    .join("");
}

// Select address
function selectAddress(_id) {
  selectedAddressId = _id;
  updateSelectedAddress();
}

// Update selected address UI
function updateSelectedAddress() {
  const addressCards = document.querySelectorAll(".address-card");
  addressCards.forEach((card) => {
    const cardId = card.dataset.id;
    if (cardId === selectedAddressId) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
  });
}

// Edit address
async function editAddress(_id, event) {
  event.stopPropagation();
  const address = addresses.find((addr) => addr._id === _id);
  if (!address) return;

  document.getElementById("name").value = address.name;
  document.getElementById("mobile").value = address.mobile;
  document.getElementById("address").value = address.address;
  document.getElementById("city").value = address.city;
  document.getElementById("state").value = address.state;
  document.getElementById("pincode").value = address.pincode;
  document.getElementById("country").value = address.country;
  document.getElementById("landmark").value = address.landmark;

  addressModal.classList.add("active");
  addresses = addresses.filter((addr) => addr._id !== _id);
}

// Delete address
async function deleteAddress(_id, event) {
  event.stopPropagation();
  if (confirm("Are you sure you want to delete this address?")) {
    try {
      // You can add API call here to delete address
      // await fetch(`/api/address/${_id}`, { method: 'DELETE' });

      addresses = addresses.filter((addr) => addr._id !== _id);
      if (selectedAddressId === _id) {
        selectedAddressId = addresses.length > 0 ? addresses[0]._id : null;
      }
      renderAddresses();
      showFlashMessage({
        success: true,
        message: "Address deleted successfully!",
      });
    } catch (error) {
      showFlashMessage({ success: false, message: error.message });
    }
  }
}

// Validate mobile number
function validatePhone(mobile) {
  const phoneRegex = /^[\d\s-()]+$/;
  return phoneRegex.test(mobile);
}

// Validate ZIP code
function validateZipCode(pincode) {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(pincode);
}

// Place Order
placeOrderBtn.addEventListener("click", async () => {
  if (!selectedAddressId) {
    showFlashMessage({
      success: false,
      message: "Please select a delivery address",
    });
    return;
  }

  try {
    const orderData = {
      addressId: selectedAddressId,
      paymentMethod: "cashOnDelivery",
      items: [],
      total: total,
    };

    // You can add API call here to place order
    // const response = await fetch('/api/orders', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(orderData)
    // });

    showOrderConfirmation(orderData);
  } catch (error) {
    showFlashMessage({ success: false, message: error.message });
  }
});

// Show order confirmation
function showOrderConfirmation(orderData) {
  console.log('order data : ', orderData)
  const selectedAddress = addresses.find(
    (addr) => addr._id === orderData.addressId
  );
  if (!selectedAddress) {
    showFlashMessage({ success: false, message: "Selected address not found" });
    return;
  }

  const confirmationContent = document.querySelector(
    "#orderConfirmModal .modal-content"
  );
  confirmationContent.innerHTML = `
    <h2>Order Confirmation</h2>
    <p>Your order has been placed successfully!</p>
    <div class="order-details">
        <p><strong>Delivery Address:</strong></p>
        <p>${selectedAddress.name}<br>
           ${selectedAddress.address}<br>
           ${selectedAddress.city}, ${selectedAddress.state} ${
    selectedAddress.pincode
  }<br>
           ${selectedAddress.country}<br>
           ${selectedAddress.landmark}</p>
        <p><strong>Payment Method:</strong> Cash on Delivery</p>
        <p><strong>Amount to be paid:</strong> ₹ ${totalAmount.toLocaleString(
          "en-US",
          { minimumFractionDigits: 2 }
        )}</p>
        <p>Please keep cash ready at the time of delivery.</p>
    </div>
    <button class="checkout-btn-primary" onclick="addOrder()">Continue Shopping</button>
  `;

  orderConfirmModal.classList.add("active");
}

// Form validation
document.getElementById("mobile").addEventListener("input", function () {
  if (!validatePhone(this.value)) {
    this.setCustomValidity("Please enter a valid mobile number");
  } else {
    this.setCustomValidity("");
  }
});

document.getElementById("pincode").addEventListener("input", function () {
  if (!validateZipCode(this.value)) {
    this.setCustomValidity(
      "Please enter a valid PIN code (e.g., 12345 or 12345-6789)"
    );
  } else {
    this.setCustomValidity("");
  }
});

// Flash message functionality
function showFlashMessage({ success, message }) {
  const notification = document.getElementById("notification");

  const messagePopup = document.createElement("div");
  messagePopup.id = "popup-message";
  messagePopup.className = success ? "success" : "failed";
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

function createCartItem(products) {
  const summeryItemsContainer = document.querySelector(".summary-items");
  const subtotalSpan = document.querySelector("#subtotal");
  const taxSpan = document.querySelector("#tax");
  const shippingSpan = document.querySelector("#shipping");
  const totalSpan = document.querySelector("#total");

  let subtotal = 0;
  let shipping;
  let tax;

  products.forEach((prod) => {
    console.log('prod : sum : ',  prod)
    summeryItemsContainer.innerHTML += `<div class="summary-item">
              <img src="${prod.thumb_image}" alt="Product" />
              <div class="item-details">
                <h3>${prod.product_name}</h3>
                <p>Color: ${prod.color}</p>
                <p>Quantity: ${prod.cartQty}</p>
              </div>
              <div class="item-price">₹ ${prod.totalPrice}</div>
            </div>`;

    subtotal += prod.totalPrice;
  });

  shipping = subtotal >= 50000 ? 0 : 800;
  tax = (subtotal + shipping) * 0.18;
  totalAmount = subtotal + tax;

  subtotalSpan.textContent = subtotal.toLocaleString("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });
  shippingSpan.textContent = shipping;
  taxSpan.textContent = tax.toLocaleString("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });
  totalSpan.textContent = totalAmount.toLocaleString("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });
  totalAmount = totalAmount;
}

// Add order
function addOrder() {
  const url = `/api/add-order`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      porductDetails,
      addressId: selectedAddressId,
      totalAmount,
    }),
  };
  fetch(url, options)
    .then((response) => {
      console.log("add order res : ", response);
      window.location.href = "/orders";
    })
    .catch((err) => console.log("add order error : ", err));
}

console.log("details : ", porductDetails);
