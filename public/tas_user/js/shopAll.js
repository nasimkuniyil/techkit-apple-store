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

document.querySelectorAll(".pagination-number").forEach((item) => {
  item.addEventListener("click", (e) => {
    url.searchParams.set("page", e.target.textContent);
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        const urlParams = new URLSearchParams(window.location.search);
        const curPage = urlParams.get("page");
        window.location.href = response.url;
      })
      .catch((err) => console.log(" shop js sort fetch error : ", err));
  });
});

// ---------------------------------------

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

// pagination ------

// let currentPage = 1;
// const itemsPerPage = 10;
// let totalPages = 3;

// // DOM elements
// const prevBtn = document.querySelector(".prev-btn");
// const nextBtn = document.querySelector(".next-btn");
// const numbersContainer = document.querySelector(".pagination-numbers");

// // Create page button element
// function createPageButton(pageNum) {
//   const btn = document.createElement("button");
//   btn.className = `pagination-number ${
//     pageNum === currentPage ? "active" : ""
//   }`;
//   btn.textContent = pageNum;
//   btn.addEventListener("click", () => goToPage(pageNum));
//   return btn;
// }

// // Create ellipsis element
// function createEllipsis() {
//   const span = document.createElement("span");
//   span.className = "pagination-ellipsis";
//   span.textContent = "...";
//   return span;
// }

// // Render pagination numbers
// function renderPaginationNumbers(n) {
//   numbersContainer.innerHTML = "";

//   // Always show first page
//   numbersContainer.appendChild(createPageButton());

//   if (totalPages <= 5) {
//     // Show all pages if total is 5 or less
//     for (let i = 2; i <= totalPages; i++) {
//       numbersContainer.appendChild(createPageButton(i));
//     }
//   } else {
//     if (currentPage > 3) {
//       numbersContainer.appendChild(createEllipsis());
//     }

//     // Show current page and surrounding pages
//     for (
//       let i = Math.max(2, currentPage - 1);
//       i <= Math.min(currentPage + 1, totalPages - 1);
//       i++
//     ) {
//       numbersContainer.appendChild(createPageButton(i));
//     }

//     if (currentPage < totalPages - 2) {
//       numbersContainer.appendChild(createEllipsis());
//     }

//     // Always show last page
//     if (totalPages > 1) {
//       numbersContainer.appendChild(createPageButton(totalPages));
//     }
//   }

//   // Update button states
//   prevBtn.disabled = currentPage === 1;
//   nextBtn.disabled = currentPage === totalPages;
// }

// // Handle page navigation
// // function goToPage(pageNum) {
// //   if (pageNum < 1 || pageNum > totalPages) return;

// //   currentPage = pageNum;
// //   renderPaginationNumbers();

// //   // Calculate offset for backend query
// //   const offset = (currentPage - 1) * itemsPerPage;

// //   // Dispatch custom event for backend integration
// //   const event = new CustomEvent("pageChange", {
// //     detail: {
// //       page: currentPage,
// //       offset: offset,
// //       limit: itemsPerPage,
// //     },
// //   });
// //   document.dispatchEvent(event);
// // }

// // Initialize pagination
// function initPagination() {
//   // Add event listeners for prev/next buttons
//   prevBtn.addEventListener("click", () => goToPage(currentPage - 1));
//   nextBtn.addEventListener("click", () => goToPage(currentPage + 1));

//   // Initial render
//   renderPaginationNumbers();
// }

// // Example of how to update total pages (e.g., after getting data from backend)
// // function updateTotalPages(newTotalPages) {
// //   totalPages = newTotalPages;
// //   if (currentPage > totalPages) {
// //     currentPage = totalPages;
// //   }
// //   renderPaginationNumbers();
// // }

// // Initialize on load
// initPagination();

// // Example of how to listen for page changes
