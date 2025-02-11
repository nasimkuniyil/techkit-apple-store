// Delete product
function deleteProduct(event, id) {
  if (confirm("Are you sure you want to delete this product?")) {
    const url = `/admin/api/product/delete?id=${id}`;
    const options = { method: "DELETE" };
    fetch(url, options)
      .then((response) => (window.location.href = '/admin/products'))
      .catch((err) => console.log("something happend in add category"));
  }
}
