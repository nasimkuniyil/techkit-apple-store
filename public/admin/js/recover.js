

//Recover product
function unblockUser(id) {
  if (confirm("Are you sure you want to recover this product?")) {
    const url = `/admin//product/unblock?id=${id}`;
    const options = { method: "GET" };
    fetch(url, options)
      .then((response) => (window.location.href = response.url))
      .catch((err) => console.log("something happend in add category"));
  }
}
