function renderProductCard(products){
    const cardList = document.querySelector('.card-list')
    cardList.innerHTML = ""
    products.forEach(prod => {
        const card = `<a href="/product/view?id=${prod._id}" class="card-item-wrapper">
      <div class="card-item" style="background-image: url(${prod.images[0].url})">
        <div class="product_info card-md">
          <h3>${prod.product_name}<span> ${prod.color.color_name}</span></h3>
          <div><span class="old-price">${prod.discountPrice ? prod.price : ""} </span> <span> ${ prod.discountPrice ? prod.offer.discountValue+"% offer" : "" } </span></div>
          <p>Price ₹${prod.discountPrice || prod.price}</p>
        </div>
      </div>
    </a>`
    cardList.innerHTML += card 
    });
}