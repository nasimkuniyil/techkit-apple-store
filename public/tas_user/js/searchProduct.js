const searchInput = document.querySelector("#search-input");
const searchForm = document.querySelector(".header-search-form");
let allProductItems;

// Search Products ----
searchForm.addEventListener("input", searchInputOnChange);
searchForm.addEventListener("submit", searchInputOnSubmit);

function searchInputOnChange(event) {
  event.preventDefault();
  const inputVal = searchInput.value.toLowerCase();
  allProductItems = document.querySelectorAll(".card-item-wrapper")
  
  renderSearchList(inputVal);
}

// Function render list items
function renderSearchList(inputVal) {
  if (allProductItems.length == 0) {
    console.log("products not available.");
    return;
  }

  allProductItems.forEach((prod) => {
    if (!prod.textContent.toLowerCase().includes(inputVal)) {
      prod.classList.add("hide");
    } else {
      prod.classList.remove("hide");
    }
  });
}

function searchInputOnSubmit(event) {
  event.preventDefault();
}