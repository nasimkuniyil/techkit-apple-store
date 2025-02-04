fetchWishlistData()

function fetchWishlistData() {
  const url = "/api/wishlist";
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("fetch data error");
      }
      return response.json();
    })
    .then((data) => {
      console.log("data : ", data);
      renderWishlistData(data.result)
    })
    .catch((err) => console.log("fetch wishlist error : ", err));
}

function renderWishlistData(data) {
    console.log('rendering...')
    console.log('result : ', data)
    let wishlistGrid = document.querySelector('.wishlist-grid');
  data.items.forEach((item) => {
    console.log('items : ', item)
    const itemCard = `<div class="wishlist-item">
                        <div class="wishlist-image">
                          <img src="${item.images[0].url}" alt="Product 1">
                          <button class="remove-btn" aria-label="Remove from wishlist">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M18 6L6 18M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                        <div class="wishlist-content">
                          <h3>${item.product_name}</h3>
                          <p class="price">₹${item.price}</p>
                          <button class="add-to-cart-btn">Add to Bag</button>
                        </div>
                      </div>`

                      wishlistGrid += itemCard;
  });

}
