

//Recover product
function unblockUser(id) {
  if (confirm("Are you sure you want to recover this product?")) {
    const url = `/admin/api/product/unblock?id=${id}`;
    const options = { method: "GET" };
    fetch(url, options)
      .then((response) => (window.location.href = '/admin/recover'))
      .catch((err) => console.log("something happend in add category"));
  }
}
