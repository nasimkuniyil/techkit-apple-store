fetchWishlistData()

function fetchWishlistData() {
  const url = "/api/wishlist";
  axios.get(url)
    .then((response) => {
      console.log("res : ", response);
      const {data} = response;
      if(data.message){
        let wishlistGrid = document.querySelector('.wishlist-container');
        wishlistGrid.innerHTML = `<p class="wishlist-empty-message">${data.message}</p>`
        return showFlashMessage(data)
      }
      renderWishlistData(data.result)  
    })
    .catch((err) => console.log("fetch wishlist error : ", err));
}

function renderWishlistData(data) {
    console.log('rendering...')
    console.log('result : ', data)
    let wishlistGrid = document.querySelector('.wishlist-grid');
    wishlistGrid.innerHTML = ""
  data.items.forEach((item) => {
    console.log('items : ', item)
    const itemCard = `<div class="wishlist-item">
                        <div class="wishlist-image">
                          <img src="${item.images[0].url}" alt="Product 1">
                          <button class="remove-btn" aria-label="Remove from wishlist" onclick="removeWishlist('${item._id}')">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M18 6L6 18M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                        <div class="wishlist-content">
                          <h3>${item.product_name}</h3>
                          <p class="price">₹${item.price}</p>
                          <button class="add-to-cart-btn" onclick="addToCart('${item._id}')">Add to Bag</button>
                        </div>
                      </div>`

    wishlistGrid.innerHTML += itemCard;
  });

}

function addToCart(id) {
  const url = "/api/add-cart";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId: id, quantity : 1 }),
  };

  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.message); // Handle errors from the server
        });
      }
      showFlashMessage({success:true, message:'Item added to cart'});
      setTimeout(() => {
        removeWishlist(id)
      }, 800);
      // return response.json();
    })
    .catch((error) => {
      const text = `${error}`;
      console.log(text);
    });
}

function removeWishlist(productId){
  axios.put('/api/wishlist/remove?id='+productId)
      .then(response=>{
        console.log('axios a result : ', response)
        showFlashMessage(response.data);
        fetchWishlistData();

    })
    .catch(err=>console.log('remove wishlist error :', err))
}