function addBreadcrumb(product) {
  const breadCrumbContainer = document.querySelector(".breadcrumb-container");

  const nav = document.createElement("nav");
  nav.classList.add("breadcrumb");
  nav.innerHTML = `<a href="/">Home</a>
          <span class="separator">›</span>
          <a href="/shop/${product.category.category_name}"
            >${product.category.category_name}</a
          >
          <span class="separator">›</span>
          <span>${product.product_name}</span>`;

  breadCrumbContainer.appendChild(nav);
}
