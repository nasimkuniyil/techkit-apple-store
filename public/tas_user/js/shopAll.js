const sortSelects = document.querySelectorAll("#sort");
const filterSelects = document.querySelectorAll("#filter");
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
