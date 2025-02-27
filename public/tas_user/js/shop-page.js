const sortSelect = document.querySelector("#sort");
const filterSelect = document.querySelector("#filter");

const url = new URL(`${window.location.origin}/api/get-all-products`);

sortSelect.addEventListener('change', sortChange);
filterSelect.addEventListener('change', filterChange);

fetchAllProducts();


// Functions
function sortChange(event){
    url.searchParams.set("sort", event.target.value);
    fetchAllProducts();
}

function filterChange(event){
    url.searchParams.set("filter", event.target.value);
    url.searchParams.set("page", 1);
    fetchAllProducts();
}

function fetchAllProducts() {
    const fetchUrl = url.toString().split('3000')[1];
  fetch(fetchUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("get all product error");
      } else {
        return response.json();
      }
    })
    .then((result) => {
        // rendering products...
        // renderProducts(result.products);
        renderProductCard(result.products);
        setupPagination(result.totalPage, result.page).addEventListener('click', (event)=> paginationFunc(event, url, fetchAllProducts));
    })
    .catch((err) => {
    });
}



// old render prods
function renderProducts(products) {
  const cardList = document.querySelector(".card-list");
  cardList.innerHTML = "";
  products.forEach((prod) => {
    // create element
    const wrapperLink = document.createElement("a");
    const cardItem = document.createElement("div");
    const productInfo = document.createElement("div");
    const title = document.createElement("h3");
    const para = document.createElement("p");

    // Add link
    wrapperLink.href = `/product/view?id=${prod._id}`

    //Add classes
    wrapperLink.classList.add("card-item-wrapper");
    cardItem.classList.add("card-item");
    productInfo.classList.add("product_info", "card-md");

    // Add value
    cardItem.style.backgroundImage = `url('${prod.images[0].url}')`
    title.textContent = prod.product_name;
    para.textContent = "₹ " + prod.price;

    //Append childrens
    productInfo.appendChild(title);
    productInfo.appendChild(para);
    cardItem.appendChild(productInfo);
    wrapperLink.appendChild(cardItem);
    cardList.appendChild(wrapperLink);
  });
}
