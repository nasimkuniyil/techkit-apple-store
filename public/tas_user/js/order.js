var orderData = [];

const url = new URL(`${window.location.origin}/api/order`);
fetchOrderData();

async function fetchOrderData() {

  
  const fetchUrl = url.pathname + url.search;
  try {
    const response = await fetch(fetchUrl);
    
    if (!response.ok) {
      const result = await response.json();
      showFlashMessage(result);
    } else {
      const result = await response.json();

      if (result?.orderData) {
        orderData.length = 0
        result.orderData.forEach((odrData) => {
          const orderDataObj = CreateOrderOng(odrData);
          orderData.push(orderDataObj);
        });

        setupPagination(result.totalPage, result.page).addEventListener('click', (event)=> paginationFunc(event, url, fetchOrderData));
        displayOrders();
      }
    }
  } catch (err) {
    console.error("Error updating cart:", err.message);
    // showFlashMessage()
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

function formatDate(dateString) {
  var options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case "pending":
      return "status-pending";
    case "delivered":
      return "status-delivered";
    case "processing":
      return "status-processing";
    case "shipped":
      return "status-shipped";
    case "cancelled":
      return "status-cancelled";
    default:
      return "";
  }
}

function createOrderCard(order) {
  var card = document.createElement("div");
  card.className = "order-card";


  var items = order.items
    .map(function (item) {
      return (
        '<div class="order-item">' +
        '<span class="item-name">' +
        item.productId.product_name +
        " - ( Qty : " +
        item.quantity +
        ")" +
        "</span>" +
        '<span class="item-price">' +
        `${(item.isReturn) ? "Returned" : formatCurrency(item.productId.price)}` +
        "</span>" +
        "</div>"
      );
    })
    .join("");

  card.innerHTML =
    '<div class="order-card-header">' +
    '<span class="order-number">' +
    order.orderId +
    "</span>" +
    '<span class="order-date">' +
    formatDate(order.orderDate) +
    "</span>" +
    "</div>" +
    '<div class="order-items">' +
    items +
    "</div>" +
    '<div class="order-footer">' +
    '<span class="order-status ' +
    getStatusClass(order.status) +
    '">' +
    order.status.charAt(0).toUpperCase() +
    order.status.slice(1) +
    "</span>" +
    '<span class="order-total">' +
    `<p>${(order.paymentStatus != 'Success' && order.paymentStatus) ? 'Payment '+order.paymentStatus : formatCurrency(order.total)}</p>` +
    "</span>" +
    "</div>";

  card.addEventListener("click", function () {
    window.location.href = "/order/view?id=" + order._id;
  });

  return card;
}

function displayOrders() {
  let ordersList = document.getElementById("ordersList");
  ordersList.innerHTML = "";

  orderData.forEach(function (order) {
    ordersList.appendChild(createOrderCard(order));
  });
}

function initializeSearch() {
  var searchInput = document.getElementById("orderSearch");
  searchInput.addEventListener("input", function (e) {
    var searchTerm = e.target.value.toLowerCase();
    var filteredOrders = orderData.filter(function (order) {
      return (
        order.orderId.toLowerCase().includes(searchTerm) ||
        order.items.some(function (item) {
          return item.name.toLowerCase().includes(searchTerm);
        })
      );
    });

    var ordersList = document.getElementById("ordersList");
    ordersList.innerHTML = "";
    filteredOrders.forEach(function (order) {
      ordersList.appendChild(createOrderCard(order));
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initializeSearch();

  // Filter functionality
  document
    .getElementById("orderFilter")
    .addEventListener("change", function (e) {
      // In a real application, this would filter orders based on the selected time period
    });
});


// Function for create Order Object
function CreateOrderOng(data) {
  return {
    _id: data._id,
    orderId: data.orderId,
    orderDate: data.createdAt,
    items: data.products,
    status: data.orderStatus,
    paymentStatus : data.paymentStatus,
    total: data.totalAmount
  };
}
