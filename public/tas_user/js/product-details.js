document.addEventListener("DOMContentLoaded", function () {
  fetchProductData();

  // Fetch data
  function fetchProductData() {
    const url = `/api/product/view${window.location.search}`;
    axios.get(url).then((response) => {
      renderProductDetails(
        response.data.product,
        response.data.availableColors,
        response.data.wishlist || "",
        response.data.userSession
      );
    });

    // call renderProductDetails(product,colors)
  }

  // Render product details
  function renderProductDetails(product, colors, wishlist, userSession) {
    const mainImage = document.querySelector(".main-image");
    const thumbImage = document.querySelector(".thumbnail-container");

    mainImage.innerHTML = "";
    thumbImage.innerHTML = "";

    // main image
    const image = document.createElement("img");
    image.src = product.images[0].url;
    image.alt = "Product image";
    image.id = "mainImage";
    mainImage.appendChild(image);

    const div = document.createElement("div");
    div.id = "zoomPane";
    mainImage.appendChild(div);

    // thumb image
    product.images.forEach((img, index) => {
      const div = document.createElement("div");
      div.classList.add("thumbnail");

      const thumbImg = document.createElement("img");
      thumbImg.classList.add('thumbnail')
      thumbImg.setAttribute("data-src", img.url);
      thumbImg.src = img.url;
      thumbImg.alt = "Thumbnail";

      div.appendChild(thumbImg);
      thumbImage.appendChild(div);
    });

    // product info start
    const productInfo = document.querySelector(".product-info");

    // product title
    const productTitle = document.createElement("h1");
    productTitle.textContent = product.product_name;
    productTitle.classList.add("product-title");
    productInfo.appendChild(productTitle);

    // product price
    const productPrice = document.createElement("h3");
    productPrice.textContent =`₹ ${product.discountPrice ||  product.price}`;
    if(product.discountPrice){
      const oldPrice = document.createElement("span");
      oldPrice.classList.add('old-price');
      oldPrice.textContent = product.price;
      productPrice.appendChild(oldPrice)
      
      const discountValue = document.createElement("span");
      discountValue.classList.add('discountValue');
      discountValue.textContent = product.offer.discountValue+'% offer';
      productPrice.appendChild(discountValue)

    }
    productInfo.appendChild(productPrice);
    

    // product rating
    const rating = document.createElement("div");
    rating.classList.add("rating");
    rating.textContent = "★★★★☆";
    const ratingSpan = document.createElement("span");
    ratingSpan.classList.add("rating-span");
    ratingSpan.textContent = "4/5";
    rating.appendChild(ratingSpan);
    productInfo.appendChild(rating);

    // available color options
    const colorOptions = document.createElement("div");
    colorOptions.classList.add("color-options");
    colors.forEach((clr) => {
      const colorLink = document.createElement("a");
      colorLink.href = `/product/view?id=${clr._id}`;
      colorLink.classList.add(
        "product-color",
        clr._id.toString() == product._id ? "active" : ""
      );
      colorLink.style.backgroundColor = `#${clr.color.color_code}`;
      colorOptions.appendChild(colorLink);
    });
    productInfo.appendChild(colorOptions);

    // product category
    const productCategory = document.createElement("div");
    productCategory.classList.add("product-category");
    const categoryLink = document.createElement("a");
    categoryLink.href = `/shop/${product.category.category_name}`;
    categoryLink.textContent = product.category.category_name
    productCategory.appendChild(categoryLink);
    productInfo.appendChild(productCategory);

    // quantity section show if stock is available
    if (product.quantity > 0) {
      // show message when the stock lessthan 10
      if (product.quantity < 10) {
        const stockMessage = document.createElement("p");
        stockMessage.classList.add("stock-status");
        stockMessage.textContent = "Only few products are left";
        productInfo.appendChild(stockMessage);
      }

      const quantitySelector = document.createElement("div");
      quantitySelector.classList.add("quantity-selector");

      const quantityDecrementBtn = document.createElement("button");
      quantityDecrementBtn.classList.add("quantity-btn");
      quantityDecrementBtn.textContent = "-";
      quantityDecrementBtn.addEventListener("click", () =>
        updateQuantity({ change: -1, prodQuantity: product.quantity })
      );
      quantitySelector.appendChild(quantityDecrementBtn);

      const quantityDisplay = document.createElement("span");
      quantityDisplay.classList.add("quantity-display");
      quantityDisplay.id = "quantity";
      quantityDisplay.textContent = "1";
      quantitySelector.appendChild(quantityDisplay);

      const quantityIncrementBtn = document.createElement("button");
      quantityIncrementBtn.classList.add("quantity-btn");
      quantityIncrementBtn.textContent = "+";
      quantityIncrementBtn.addEventListener("click", () =>
        updateQuantity({ change: 1, prodQuantity: product.quantity })
      );
      quantitySelector.appendChild(quantityIncrementBtn);

      productInfo.appendChild(quantitySelector);
    } else {
      const stockMessage = document.createElement("p");
      stockMessage.classList.add("stock-status");
      stockMessage.textContent = "Out of stock";
      productInfo.appendChild(stockMessage);
    }

    // add to cart and wishlist buttons
    const actionBtns = document.createElement("div");
    actionBtns.classList.add("action-buttons");

    const addToCartBtn = document.createElement("button");
    addToCartBtn.classList.add("add-to-cart");
    addToCartBtn.textContent = "Add to cart";
    addToCartBtn.addEventListener("click", () => addToCart(product._id));
    actionBtns.appendChild(addToCartBtn);

  if(userSession){
    const addToWishlistBtn = document.createElement("button");
    addToWishlistBtn.classList.add("add-to-wishlist");
    addToWishlistBtn.addEventListener("click", () =>
      addToWishlist(product._id)
  );
    addToWishlistBtn.innerHTML =  (wishlist && wishlist.items.includes(product._id)) ? `<i class="fas fa-heart"></i>` : `<i class="far fa-heart"></i>`;
    actionBtns.appendChild(addToWishlistBtn);
  }

    productInfo.appendChild(actionBtns)
    // prodcut info end

    // product description
    const descriptionContent = document.querySelector(".description-content");
    const descriptionTitle = document.createElement("h2");
    descriptionTitle.textContent = "About " + product.product_name;
    descriptionContent.appendChild(descriptionTitle);

    const descriptionPara = document.createElement("p");
    descriptionPara.textContent = product.description;
    descriptionContent.appendChild(descriptionPara);

    imageZoomFunc()
  }

  // Render recommended products
  function renderRecommendedProducts(recProducts) {}

  // Image Gallery and Zoom Functionality
  function imageZoomFunc() {
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
  }

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
  
  function updateQuantity({ change, prodQuantity }) {
    const quantityDisplay = document.getElementById("quantity");
    const newQuantity = quantity + change;
    maxStock = maxStock >= prodQuantity ? prodQuantity : maxStock;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      quantity = newQuantity;
      quantityDisplay.textContent = quantity;
    }
  }
  
  // Cart and Wishlist Functions
  function addToCart(id) {
    const url = window.location.origin + "/api/add-cart";
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
      })
      .catch((error) => {
        const text = `${error}`;
        console.log(text);
      });
  }

  function addToWishlist(productId) {
    const wishlistBtn = document.querySelector(".add-to-wishlist i");

    let url;
    let options;

    if (wishlistBtn.className.includes("far")) {
      axios.post('/api/wishlist/add?id='+productId)
      .then(response=>{
        wishlistBtn.classList.add("fas");
        wishlistBtn.classList.remove("far");
        showFlashMessage(response.data)
      })
      .catch(err=>console.log('add wishlist error :', err))
    } else if (wishlistBtn.className.includes("fas")) {
      axios.put('/api/wishlist/remove?id='+productId)
      .then(response=>{
        wishlistBtn.classList.add("far");
        wishlistBtn.classList.remove("fas");
        showFlashMessage(response.data)

    })
    .catch(err=>console.log('remove wishlist error :', err))

    }
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
    const reviewText = event.target.querySelector("textarea").value;

    if (userRating === 0) {
      console.log("Please select a rating");
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
});
