// DOM Elements
const addressModal = document.getElementById("addressModal");
const orderConfirmModal = document.getElementById("orderConfirmModal");
const addAddressBtn = document.getElementById("addAddressBtn");
const cancelAddressBtn = document.getElementById("cancelAddress");
const addressForm = document.getElementById("addressForm");
const addressList = document.getElementById("addressList");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const paymentOption = document.querySelector(".payment-method");

// Sample addresses (Replace with your data storage solution)
let addresses = [];

let porductDetails = [];

let selectedAddressId = null;
let selectedPaymentMethod = null;
let couponDiscountPercentage = 0;
let totalAmount = 0;

// Initial load
fetchCoupon();
fetchAddresses();
fetchCartData();

paymentOption.addEventListener("input", (e) => {
  if (e.target.checked) {
    selectedPaymentMethod = e.target.id;
  }
});

// Fetch addresses from API
async function fetchAddresses() {
  try {
    const response = await fetch("/api/address");
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    const updatedAdd = data.map((add) => {
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
    if (data.cartProducts.cartTotalAmount >= 10000) {
      document.getElementById("cod-section").innerHTML =
        "Cash on delivery not available above 10000";
    }
    if (data.cartProducts) {
      porductDetails.push(...data.cartProducts.items);
      createCartItem(data.cartProducts.items);
    }
  } catch (err) {
    console.error("Error fetching cart:", err);
  }
}

async function fetchCoupon() {
  const url = "/api/coupon";

  try {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.textContent);
        }
        return response.json();
      })
      .then((data) => {
        if (data.coupon) {
          showFlashMessage({ success: true, message: "Coupon applied" });
          document.querySelector("#coupon").textContent =
            "-" + data.coupon.discountValue + "%";
          couponDiscountPercentage = data.coupon.discountValue / 100;
        }
      });
  } catch (err) {
    console.error("Error fetching coupon:", err);
  }
}

// Event Listeners
addAddressBtn.addEventListener("click", () => {
  addressForm.addEventListener("submit", saveAddress);
  addressModal.classList.add("active");
});

cancelAddressBtn.addEventListener("click", () => {
  addressModal.classList.remove("active");
  addressForm.reset();
});

// handle address form submit
async function saveAddress(event) {
  event.preventDefault();

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
    const url = "/api/add-address";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAddress),
    };
    // add API call here to save address
    const response = await fetch(url, options);

    addresses.push(newAddress);
    fetchAddresses();

    addressModal.classList.remove("active");
    addressForm.reset();

    showFlashMessage({ success: true, message: "Address added successfully!" });
  } catch (error) {
    showFlashMessage({ success: false, message: error.message });
  }
}

// Render addresses
function renderAddresses() {
  addressList.innerHTML = addresses
    .map((address) => {
      return `
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
      `;
    })
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
function editAddress(_id, event) {
  event.stopPropagation();
  const address = addresses.find((addr) => addr._id === _id);
  if (!address) return;

  document.getElementById("address-modal-title").textContent = "Edit address";
  document.getElementById("name").value = address.name;
  document.getElementById("mobile").value = address.mobile;
  document.getElementById("address").value = address.address;
  document.getElementById("city").value = address.city;
  document.getElementById("state").value = address.state;
  document.getElementById("pincode").value = address.pincode;
  document.getElementById("country").value = address.country;
  document.getElementById("landmark").value = address.landmark;
  document
    .getElementById("addressForm")
    .addEventListener("submit", (event) => submitEditAddress(event, _id));

  addressModal.classList.add("active");
}

// Submit edit address
function submitEditAddress(event, _id) {
  event.stopPropagation();
  const editedAddress = {
    name: document.getElementById("name").value,
    mobile: document.getElementById("mobile").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    country: document.getElementById("country").value,
    pincode: document.getElementById("pincode").value,
    landmark: document.getElementById("landmark").value,
  };
  const url = `/api/edit-address?addressId=${_id}`;
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedAddress),
  };

  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
    })
    .catch((err) => showFlashMessage({ success: false, message: err.message }));
}

// Delete address
async function deleteAddress(_id, event) {
  event.stopPropagation();
  if (confirm("Are you sure you want to delete this address?")) {
    try {
      const response = await fetch(`/api/remove-address?addressId=${_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      showFlashMessage(data);

      fetchAddresses();
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
placeOrderBtn.addEventListener("click", placeOrderFunc);

function placeOrderFunc() {
  if (selectedPaymentMethod == "cashOnDelivery") {
    placeOrderWithCOD();
  } else {
    payNow();
  }
}

// razorpay function
async function payNow() {
  let products = [];

  porductDetails.forEach((prod) => {
    const data = {
      productId: prod.productId._id,
      quantity: prod.quantity,
      price: prod.price,
    };
    products.push(data);
  });

  const url = `/api/add-order`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      products,
      addressId: selectedAddressId,
      paymentInfo: selectedPaymentMethod,
    }),
  };
  fetch(url, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(async (data)=>{
      window.localStorage.setItem("products", JSON.stringify(products));
        window.localStorage.setItem("addressId", selectedAddressId);
        window.localStorage.setItem("paymentInfo", selectedPaymentMethod);
        window.localStorage.setItem("totalAmount", totalAmount);

        // Create order by calling the server endpoint
        const response = await fetch("/api/online-payment?orderId="+data.order._id, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            totalAmount,
            currency: "INR",
            receipt: "receipt#1",
            notes: {},
          }),
        });

        if(!response.ok){
          window.location.href = '/orders'
        }

        const order = await response.json();

        // Open Razorpay Checkout
        const options = {
          key: "rzp_test_hGYKC7nv8aVuxX",
          amount: totalAmount * 100,
          currency: "INR",
          order_id: order.id,
          callback_url: "https://techkit.site/api/online-payment/success?payment=onlinePayment&orderId="+data.order._id,
        };

        const rzp = new Razorpay(options);
        rzp.open();
    })
    .catch((err) => console.log("add order error : ", err));
}

async function placeOrderWithCOD() {
  if (!selectedAddressId) {
    showFlashMessage({
      success: false,
      message: "Please select a delivery address",
    });
    return;
  }

  if (!selectedPaymentMethod) {
    showFlashMessage({
      success: false,
      message: "Please select a payment method",
    });
    return false;
  }

  try {
    const orderData = {
      addressId: selectedAddressId,
      items: [],
      total: total,
    };

    addOrder(orderData);
  } catch (error) {
    showFlashMessage({ success: false, message: error.message });
  }
}

// Show order confirmation
function showOrderConfirmation(orderData) {
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

  confirmationContent.innerHTML = `<div class="success-container">
  <div class="success-content">
    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
      <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
    </svg>
    
    <h1>Thank you for your order.</h1>
    <p class="order-number">Order #2458712</p>
    <p class="message">We'll send you a shipping confirmation email when your order ships.</p>
    
    <div class="delivery-info">
      <p class="delivery-date">Arrives by Wed, Jan 24</p>
      <p class="delivery-address"><p>${selectedAddress.address},${selectedAddress.city},${selectedAddress.state} ${selectedAddress.pincode}<br></p>
    </div>
    
    <a href="/orders" class="continue-btn">Continue Shopping</a>
  </div>
</div>`;
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

function createCartItem(products) {
  const summeryItemsContainer = document.querySelector(".summary-items");
  const subtotalSpan = document.querySelector("#subtotal");
  const shippingSpan = document.querySelector("#shipping");
  const totalSpan = document.querySelector("#total");

  let subtotal = 0;
  let shipping;
  let tax;

  products.forEach((prod) => {
    summeryItemsContainer.innerHTML += `<div class="summary-item">
              <img src="${prod.productId.images[0].url}" alt="Product" />
              <div class="item-details">
                <h3>${prod.productId.product_name}</h3>
                <p>Color: ${prod.productId.color}</p>
                <p>Quantity: ${prod.quantity}</p>
              </div>
              <div class="item-price">₹ ${prod.totalPrice}</div>
            </div>`;

    subtotal += prod.totalPrice;
  });

  shipping = subtotal >= 50000 ? 0 : 800;
  totalAmount = subtotal - subtotal * couponDiscountPercentage;

  subtotalSpan.textContent = subtotal.toLocaleString("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });
  shippingSpan.textContent = shipping;
  totalSpan.textContent = totalAmount.toLocaleString("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });
  totalAmount = totalAmount;
}

// Add order
function addOrder(orderData) {
  let products = [];

  porductDetails.forEach((prod) => {
    const data = {
      productId: prod.productId._id,
      quantity: prod.quantity,
      price: prod.price,
    };
    products.push(data);
  });

  const url = `/api/add-order`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      products,
      addressId: selectedAddressId,
      paymentInfo: selectedPaymentMethod,
    }),
  };
  fetch(url, options)
    .then((response) => {
      if (response.ok) {
        showOrderConfirmation(orderData);
      }
    })
    .catch((err) => console.log("add order error : ", err));
}