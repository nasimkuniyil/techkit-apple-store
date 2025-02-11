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
      const message = document.createElement("h3");
      message.style.textAlign = "center";
      message.textContent = `Cart items not available.`;
      document.querySelector(".cart-items").appendChild(message);
      document.querySelector(".cart-summary").style.visibility = "hidden";
      throw new Error("Failed to fetch cart");
    }

    const data = await response.json();
    if (data.cartProducts) {
      cartProducts = data.cartProducts.items;
      console.log("data:", cartProducts);
      cartId = data.cartId;
      createCartItem(cartProducts);
      attachEventListeners(cartProducts);
      updateCartSummery();
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
    window.location.href = "/cart";
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
    .map((product) => {
      // const imgSrc = "data:image/"+product.productId.images[0].contentType+"; base64,"+product.productId.images[0].data.toString('base64') ;
      // console.log('hey : ', imgSrc)
    const imageData = product.productId.images[0].data; 
    const contentType = product.productId.images[0].contentType; 
    // let imgSrc =`data:image/${contentType};base64,${imageData.toString('base64')}`;
    
      return `
    <div class="cart-item" id="${product.productId._id}" data-stock="${product.productId.quantity}">
      <img
        src="${product.productId.images[0]?.url}"
        alt="Product"
        class="item-image"
      />
      <div class="item-details">
        <h3 class="item-name">${product.productId.product_name}</h3>
        <p class="item-single-price">${product.discountPrice || product.productId.price}</p>
        <span class='cartDiscountDispaly'>${product.discountPrice ? 'Offer price' : ''}</span>
        <div class="quantity-selector">
          <button class="quantity-btn decrease" ${
            product.quantity <= 1 ? "disabled" : ""
          }>−</button>
          <span class="quantity">${product.quantity}</span>
          <button class="quantity-btn increase" ${
            product.quantity >= 5 ? "disabled" : ""
          }>+</button>
        </div>
        ${
          product.productId.quantity < 5
            ? `<p class="stock-info">Stock: ${product.productId.quantity}</p>`
            : ""
        }
      </div>
      <div class="item-price">
        <p class="price">${product.totalPrice}</p>
        <button class="remove-btn" onClick="${()=>removeCartItem(product.productId._id)}" >Remove</button>
      </div>
    </div>
  `;
    })
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

  document.querySelector(".checkout-btn").addEventListener("click", (e) => {
    window.location.href = `/checkout?id=${cartId}`;
  });
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

function updateCartSummery() {
  const pricesElem = document.querySelectorAll("p.price");
  const subtotalElem = document.querySelector("#subtotal");
  const totalElem = document.querySelector("#total");

  let subtotal = 0;
  pricesElem.forEach((p) => {
    subtotal += parseInt(p.textContent);
  });
  subtotalElem.textContent = subtotal;
  totalElem.textContent = subtotal;
}


// Remove cart item
function removeCartItem(id){
  const url =  `/api/remove-cart`;
  const options = {
    method:'DELETE',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({productId : id})
  }
  fetch(url, options).then(response=>{
    if(!response.ok){
      throw new Error('something went wrong');
    }
    window.location.href = '/admin/cart'
  }).catch(err=> alert(err.message))
}