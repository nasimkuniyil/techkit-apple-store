let ordersData = [];

fetchOrdersData();

// Search functionality
document.querySelector(".order-search").addEventListener("input", function (e) {
  const searchText = e.target.value.toLowerCase();
  document.querySelectorAll(".order-table tbody tr").forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchText) ? "" : "none";
  });
});

// Status select functionality
document.querySelectorAll(".order-status-select").forEach((select) => {
  // Set initial color
  updateSelectColor(select);

  select.addEventListener("change", function () {
    updateSelectColor(this);
  });
});

function updateSelectColor(select) {
  // Remove all status classes
  select.classList.remove("pending", "completed", "cancelled");
  // Add the appropriate class
  select.classList.add(select.value);
}

async function fetchOrdersData() {
  try {
    const url = "/admin/api/orders";
    const response = await fetch(url);
    const result = await response.json();
    console.log("order data : ", result);
    if (!response.ok) {
      showFlashMessage(result.data);
      return;
    } else {
      result.data.forEach(data => {
        data.orders.forEach(ord => ordersData.push(CreateOrderDateObj(ord)))
      });
      renderOrderData();
    }
  } catch (err) {
    console.log("fetch error : ", err);
  }
}

function renderOrderData() {
  const orderDataContainer = document.querySelector("#order-data");

  ordersData.forEach((ord, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${index + 1}</td>
                <td>${ord.orderId}</td>
                <td>${ord.name}</td>
                <td>${ord.products}</td>
                <td>₹ ${ord.total}</td>
                <td>
                    <select class="order-status-select">
                        <option value="pending" ${
                          ord.orderStatus == "Processing" && "selected"
                        }>Pending</option>
                        <option value="completed" ${
                          ord.orderStatus == "Completed" && "selected"
                        }>Completed</option>
                        <option value="cancelled" ${
                          ord.orderStatus == "Cancelled" && "selected"
                        }>Cancelled</option>
                    </select>
                </td>
                <td>${ord.createdAt}</td>`;

    orderDataContainer.appendChild(tr);
  });
}

function CreateOrderDateObj(data) {
  let obj = {};
    obj.createdAt = data.orderDate;
    obj.orderId = data.orderId;
    obj.name = "User Name";
    obj.total = data.totalAmount;
    obj.status = data.orderStatus;

    let products = [];
    data.items.forEach((prod) => {
      products.push(prod.product_name);
    });

    obj.products = products;

  console.log("object created : ", obj);
  return obj;
}
