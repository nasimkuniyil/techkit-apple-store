var orderData = [];

fetchOrderData();

async function fetchOrderData() {
  const url = "/api/order";
  try {
    const response = await fetch(url);

    if (!response.ok) {
      const result = await response.json();
      console.log("res :", result);
      showFlashMessage(result);
    } else {
      const result = await response.json();
      if (result?.orderData) {
        console.log("hello ; ", result.orderData);

        result.orderData.forEach((odrData) => {
          console.log(
            " - = - : ",
            odrData.products.reduce((acc, item) => {
              acc += item.productId.price * item.quantity;
              return acc;
            }, 0)
          );
          const orderDataObj = CreateOrderOng(odrData);
          orderData.push(orderDataObj);
        });

        displayOrders();
      }
    }
  } catch (err) {
    console.error("Error updating cart:", err.message);
    // showFlashMessage()
    alert("An error occurred while updating the cart");
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

  console.log("jhgj : ", order);

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
        formatCurrency(item.productId.price) +
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
    formatCurrency(order.total) +
    "</span>" +
    "</div>";

  card.addEventListener("click", function () {
    window.location.href = "/order/view?id=" + order._id;
  });

  return card;
}

function displayOrders() {
  var ordersList = document.getElementById("ordersList");
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

  // Load more button functionality
  document.getElementById("loadMoreBtn").addEventListener("click", function () {
    // In a real application, this would load more orders from the server
    alert("fetching order....");
  });

  // Filter functionality
  document
    .getElementById("orderFilter")
    .addEventListener("change", function (e) {
      // In a real application, this would filter orders based on the selected time period
      alert(
        "In a real application, this would filter orders based on the selected time period: " +
          e.target.value
      );
    });
});

// SHOW FLASH MESSAGE
function showFlashMessage({ success, message }) {
  const notification = document.getElementById("notification");

  const messagePopup = document.createElement("div");

  messagePopup.id = "popup-message";
  messagePopup.className = "";
  messagePopup.classList.add(success ? "success" : "failed");
  messagePopup.textContent = message;
  notification.appendChild(messagePopup);
  removeElem(messagePopup);
}

function removeElem(div) {
  let timeout;
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    div.classList.add("hide");
    setTimeout(() => {
      clearTimeout(timeout);
      div.remove();
    }, 500);
  }, 2500);
}

// Function for create Order Object
function CreateOrderOng(data) {
  return {
    _id: data._id,
    orderId: data.orderId,
    orderDate: data.orderDate,
    items: data.products,
    status: data.orderStatus,
    total: data.products.reduce((acc, item) => {
      acc += item.productId.price * item.quantity;
      return acc;
    }, 0),
  };
}
