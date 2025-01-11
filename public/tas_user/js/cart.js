const cartItem = document.querySelector("#cartItems");

let cartProducts;
let cartId;

fetchCartData();

// fetch Cart Data
async function fetchCartData() {
  const url = "/api/cart";

  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const message = document.createElement('h3');
      message.style.textAlign = 'center';
      message.textContent = `Cart items not available.`;
      document.querySelector('.cart-items').appendChild(message)
      document.querySelector('.cart-summary').style.visibility = 'hidden';
      throw new Error("Failed to fetch cart");
    }
  
    const data = await response.json();
    if (data.cartProducts) {
      cartProducts = data.cartProducts;
      console.log("data:", data.cartProducts);
      cartId = data.cartId;
      createCartItem(cartProducts);
      attachEventListeners(cartProducts);
      updateCartSummery()
    }
  } catch (err) {
    console.error("Error fetching cart:", err);
  }
}

// Cart update
async function updateCart(data) {
  const url = window.location.origin + "/api/update-cart";

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const result = await response.json();
      console.log("res :", result);
      stock = result.prodQty;
      showFlashMessage(result);
    } else {
      const result = await response.json();
      if (result.deleted) {
        window.location.href = "/cart";
      }
    }
  } catch (err) {
    console.error("Error updating cart:", err.message);
    // showFlashMessage()
    alert("An error occurred while updating the cart");
  }
}

async function removeItemFromCart(productId) {
  const url = window.location.origin + "/api/remove-cart";

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete item");
    }

    const cartItem = document.getElementById(productId);
    // if (cartItem) {
    //   cartItem.remove();
    // }
    window.location.href = '/cart'
  } catch (err) {
    console.error("Error removing item:", err);
    alert("An error occurred while removing the item");
  }
}

function updateButtonStates(container, quantity, stock) {
  const maxQty = Math.min(5, stock);
  const decreaseBtn = container.querySelector(".decrease");
  const increaseBtn = container.querySelector(".increase");

  if (decreaseBtn && increaseBtn) {
    decreaseBtn.disabled = quantity <= 1;
    increaseBtn.disabled = quantity >= maxQty;
  }
}

function createCartItem(products) {
  const cartItems = products
    .map(
      (product) => `
    <div class="cart-item" id="${product.id}" data-stock="${product.quantity}">
      <img
        src="../../../../${product.thumb_image.replace(/\\/g, "/")}"
        alt="Product"
        class="item-image"
      />
      <div class="item-details">
        <h3 class="item-name">${product.product_name}</h3>
        <p class="item-single-price">${product.price}</p>
        <div class="quantity-selector">
          <button class="quantity-btn decrease" ${
            product.cartQty <= 1 ? "disabled" : ""
          }>−</button>
          <span class="quantity">${product.cartQty}</span>
          <button class="quantity-btn increase" ${
            product.cartQty >= Math.min(5, product.stock) ? "disabled" : ""
          }>+</button>
        </div>
        ${
          product.stock < 5
            ? `<p class="stock-info">Stock: ${product.stock}</p>`
            : ""
        }
      </div>
      <div class="item-price">
        <p class="price">${product.totalPrice}</p>
        <button class="remove-btn">Remove</button>
      </div>
    </div>
  `
    )
    .join("");

  cartItem.innerHTML = cartItems;
}

function attachEventListeners() {
  document.querySelectorAll(".cart-item").forEach((cartItemElement) => {
    console.log("HHH : ", cartItemElement);
    const productId = cartItemElement.id;
    const stock = parseInt(cartItemElement.dataset.stock);

    const qtyDisplay = cartItemElement.querySelector(".quantity");
    const singlePrice = cartItemElement.querySelector(".item-single-price");
    const totalPrice = cartItemElement.querySelector(".price");
    let currentQty = parseInt(qtyDisplay.textContent);

    // Handle quantity updates
    cartItemElement
      .querySelector(".quantity-selector")
      .addEventListener("click", async (event) => {
        const button = event.target;
        if (!button.classList.contains("quantity-btn") || button.disabled)
          return;

        let newQty = currentQty;
        const maxQty = Math.min(5, stock);

        if (button.classList.contains("increase") && currentQty < maxQty) {
          newQty = currentQty + 1;
        } else if (button.classList.contains("decrease") && currentQty > 1) {
          newQty = currentQty - 1;
        } else {
          return;
        }
        
        // Update UI first
        qtyDisplay.textContent = newQty;
        currentQty = newQty;
        totalPrice.textContent = newQty * singlePrice.textContent;
        updateButtonStates(cartItemElement, newQty, stock);
        updateCartSummery();
        
        // Then update server
        try {
          await updateCart({
            productId: productId,
            quantity: newQty,
            deleted: false,
          });
        } catch (error) {
          // Revert UI if server update fails
          qtyDisplay.textContent = currentQty;
          updateButtonStates(cartItemElement, currentQty, stock);
        }
      });

    // Handle remove button
    cartItemElement
      .querySelector(".remove-btn")
      .addEventListener("click", () => {
        removeItemFromCart(productId);
      });
  });

  document.querySelector('.checkout-btn').addEventListener('click', (e)=>{
    window.location.href = `/checkout?id=${cartId}`
  })
}

// Add styles
const style = document.createElement("style");
style.textContent = `
  .quantity-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .stock-info {
    font-size: 0.8em;
    color: #666;
    margin-top: 4px;
  }
  .cart-item {
    margin-bottom: 1rem;
  }
`;
document.head.appendChild(style);

// SHOW FLASH MESSAGE
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

function updateCartSummery() {
  const pricesElem = document.querySelectorAll("p.price");
  const subtotalElem = document.querySelector("#subtotal");
  const totalElem = document.querySelector("#total");

  let subtotal = 0;
  pricesElem.forEach(p =>{
    subtotal += parseInt(p.textContent)
  })
  subtotalElem.textContent = subtotal;
  totalElem.textContent = subtotal;
}