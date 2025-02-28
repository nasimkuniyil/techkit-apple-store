const searchInput = document.querySelector("#search-input");
const searchForm = document.querySelector(".header-search-form");
const productLists = document.querySelector("#product-search-list");

let allProducts = [];

window.addEventListener('unload', (e)=> {
    searchInput.value=''
})

// -------------------- EVENT LISTENERS -------------------- //
searchInput.addEventListener("focus", searchInputOnFocus);
searchForm.addEventListener("input", searchInputOnChange);
searchForm.addEventListener("submit", searchInputOnSubmit);

// -------------------- FUNCTIONS -------------------- //

// Function get app products
async function searchInputOnFocus(event) {
  const url = "/api/get-all-products";
  try {
    const response = await fetch(url);
    const result = await response.json();
    if (response.ok) {
      allProducts.push(...result.products);
    } else {
      console.log("something error");
    }
  } catch (err) {
    console.log("fetch all product api error : ", err);
  }
}

// Function render list items
function renderSearchList(inputVal) {
  productLists.innerHTML = "";
  if (allProducts.length == 0) {
    return;
  }

  allProducts.forEach((prod) => {
    if (prod.product_name.toLowerCase().includes(inputVal) || prod.color.toLowerCase().includes(inputVal)) {
      const listItem = `<a href=/product/view?id=${prod._id}><li>${prod.product_name} - ${prod.color}</li></a>`;
      productLists.innerHTML += listItem;
    }
  });
}

// Function search items
function searchInputOnSubmit(event) {
  event.preventDefault();
}


function searchInputOnChange(event) {
  event.preventDefault();
  const inputVal = searchInput.value.toLowerCase();

  renderSearchList(inputVal);
}
