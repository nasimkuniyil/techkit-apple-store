const sortSelects = document.querySelectorAll("#sort");
const filterSelects = document.querySelectorAll("#filter");

const searchInput = document.querySelector("#search-input");
const searchForm = document.querySelector(".header-search-form");
const allProductItems = document.querySelectorAll(".card-item-wrapper");

const url = new URL(window.location.href);
sortSelects.forEach((select) => {
  select.addEventListener("change", () => {
    console.log(`${select.id}:`, select.value);
    url.searchParams.set("sort", select.value);
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => (window.location.href = response.url))
      .catch((err) => console.log(" shop js sort fetch error : ", err));
  });
});
filterSelects.forEach((select) => {
  select.addEventListener("change", () => {
    console.log(`${select.id}:`, select.value);
    url.searchParams.set("filter", select.value);
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => (window.location.href = response.url))
      .catch((err) => console.log(" shop js sort fetch error : ", err));
  });
});

function updatePage() {
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => (window.location.href = response.url))
    .catch((err) => console.log(" shop js sort fetch error : ", err));
}

// Search Products ----
searchForm.addEventListener("input", searchInputOnChange);
searchForm.addEventListener("submit", searchInputOnSubmit);

function searchInputOnChange(event) {
  event.preventDefault();
  const inputVal = searchInput.value.toLowerCase();

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

