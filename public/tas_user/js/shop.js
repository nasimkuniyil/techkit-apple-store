const selects = document.querySelectorAll("select");
selects.forEach((select) => {
  select.addEventListener("change", () => {
    console.log(`${select.id}:`, select.value);

    const url = new URL(window.location.href);
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
