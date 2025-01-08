
const cartItems = document.querySelectorAll(".cart-item");
async function updateCart(data) {
  const url = window.location.origin + "/update-cart";
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    await fetch(url, options).then((response) => {
      if (response.ok) {
        alert("Cart updated");
        return response.json();
      } else {
        throw new Error("Failed to update cart");
      }
    }).then(data =>{
        if(data.deleted){
            window.location.href = '/cart';
        }
    });
  } catch (err) {
    console.error("Error updating cart:", err);
    alert("An error occurred while updating the cart");
  }
}

function removeItemFromCart(){
    const url = window.location.origin + "/delete-cart";
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    };
    fetch(url,options)
    .then()
    .catch()
}

cartItems.forEach((item) => {
  const parent = document.getElementById(`${item.id}`);
  const qtyDisplay = parent.querySelector("span.quantity");

  item.addEventListener("click", (event) => {
    const elem = event.target;
    let updateData = {
      productId: item.id,
      quantity: qtyDisplay.textContent,
      deleted: false,
    };

    if (elem.className == "quantity-btn increase") {
      updateData.quantity = ++qtyDisplay.textContent;
      updateCart(updateData);
    }
    if (elem.className == "quantity-btn decrease") {
      updateData.quantity = --qtyDisplay.textContent;
      updateCart(updateData);
    }

    if (elem.className == "remove-btn") {
      updateData.deleted = true;
      updateCart(updateData);
    }
  });
});

// Cart state management
// let cartState = {
//     items: [],
//     subtotal: 0,
//     shipping: 0
// };
// // specs: '128GB - Space Black',

// fetch('/cart-data')
// .then(response => response.json())
// .then(data => cartState.items.push(...data))
// .then(()=> console.log(cartState))

// // Initialize cart when page loads
// document.addEventListener('DOMContentLoaded', () => {
//     // Sample initial cart data - In a real app, this would come from your backend
//     // cartState.items = [
//     //     {
//     //         id: 1,
//     //         name: 'iPhone 15 Pro',
//     //         price: 999,
//     //         quantity: 1,
//     //         image: '/api/placeholder/120/120'
//     //     }
//     // ];

//     fetch('/cart-data')
//     .then(response => response.json())
//     .then(data => cartState.items.push(...data))
//     .then(()=> console.log(cartState))

//     renderCart();
//     setupEventListeners();
// });

// // Render the entire cart
// function renderCart() {
//     const cartContainer = document.getElementById('cartItems');
//     cartContainer.innerHTML = '';

//     cartState.items.forEach(item => {
//         const itemElement = createCartItemElement(item);
//         cartContainer.appendChild(itemElement);
//     });

//     updateCartTotals();
// }

// // Create HTML element for a cart item
// function createCartItemElement(item) {
//     const itemDiv = document.createElement('div');
//     itemDiv.className = 'cart-item';
//     itemDiv.dataset.itemId = item.id;

//     // <p class="item-specs">${item.specs}</p>
//     itemDiv.innerHTML = `
//         <img src="${item.image}" alt="${item.name}" class="item-image">
//         <div class="item-details">
//             <h3 class="item-name">${item.name}</h3>
//             <div class="quantity-selector">
//                 <button class="quantity-btn decrease">−</button>
//                 <span class="quantity">${item.quantity}</span>
//                 <button class="quantity-btn increase">+</button>
//             </div>
//         </div>
//         <div class="item-price">
//             <p class="price">$${(item.price * item.quantity).toFixed(2)}</p>
//             <button class="remove-btn">Remove</button>
//         </div>
//     `;

//     return itemDiv;
// }

// // Set up event listeners for cart interactions
// function setupEventListeners() {
//     document.getElementById('cartItems').addEventListener('click', (e) => {
//         const cartItem = e.target.closest('.cart-item');
//         if (!cartItem) return;

//         const itemId = parseInt(cartItem.dataset.itemId);
//         const item = cartState.items.find(i => i.id === itemId);

//         if (e.target.classList.contains('increase')) {
//             updateItemQuantity(itemId, item.quantity + 1);
//         }
//         else if (e.target.classList.contains('decrease')) {
//             if (item.quantity > 1) {
//                 updateItemQuantity(itemId, item.quantity - 1);
//             }
//         }
//         else if (e.target.classList.contains('remove-btn')) {
//             removeItem(itemId);
//         }
//     });

//     // Add checkout button handler
//     document.querySelector('.checkout-btn').addEventListener('click', () => {
//         // Implement checkout logic here
//         console.log('Proceeding to checkout with items:', cartState.items);
//     });
// }

// // Update item quantity
// function updateItemQuantity(itemId, newQuantity) {
//     const itemIndex = cartState.items.findIndex(item => item.id === itemId);
//     if (itemIndex !== -1) {
//         cartState.items[itemIndex].quantity = newQuantity;
//         renderCart();
//     }
// }

// // Remove item from cart
// function removeItem(itemId) {
//     cartState.items = cartState.items.filter(item => item.id !== itemId);
//     renderCart();
// }

// // Update cart totals
// function updateCartTotals() {
//     const subtotal = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//     const shipping = subtotal > 0 ? 0 : 0; // Free shipping in this example
//     const total = subtotal + shipping;

//     document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
//     document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
//     document.getElementById('total').textContent = `$${total.toFixed(2)}`;
// }

// // Add to cart function (to be called from product pages)
// function addToCart(product) {
//     const existingItem = cartState.items.find(item => item.id === product.id);

//     if (existingItem) {
//         existingItem.quantity += 1;
//     } else {
//         cartState.items.push({
//             ...product,
//             quantity: 1
//         });
//     }

//     renderCart();
// }
