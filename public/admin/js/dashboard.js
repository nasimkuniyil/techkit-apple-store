const timeSelect = document.querySelector(".time-select");

fetchReportData();

timeSelect.addEventListener("change", (event) => {
  const selectedPeriod = event.target.value;
  if (selectedPeriod !== "custom") {
    fetchReportData(`/admin/api/report?filterType=${selectedPeriod}`);
  }
});


function fetchReportData(url = "/admin/api/report") {
  axios
    .get(url)
    .then((response) => {
      console.log("reuslt : ", response);
      orderDetails(response.data.allOrders)
      setupChart(timeSelect.value, response.data);
      renderTopProducts(response.data.topProducts);
      renderTopCategories(response.data.topCategories);
    })
    .catch((err) => console.error("Error fetching report data:", err));
}

//   RENDER TOP 10 PRODUCTS
function renderTopProducts(products) {
  const topProdGrid = document.querySelector(".products-grid");
  topProdGrid.innerHTML = "";

  products.forEach((prod) => {
    const itemCard = ` <div class="product-card">
                    <div class="product-image">
                        <img src="${prod.images[0].url}" alt="Product Image">
                    </div>
                    <div class="product-info">
                        <h2 class="product-name">${prod.productName}</h2>
                        <p class="product-price">₹${prod.price}</p>
                    </div>
                  </div>`;

    topProdGrid.innerHTML += itemCard;
  });
}

//   RENDER TOP 10 PRODUCTS
function renderTopCategories(categories) {
  const topCatGrid = document.querySelector(".categories-grid");
  topCatGrid.innerHTML = "";

  categories.forEach((cat) => {
    const itemCard = ` <div class="product-card">
                    <div class="product-info">
                        <h2 class="product-name">${cat.categoryName}</h2>
                        <p>Total : ${cat.totalPurchases}</p>
                    </div>
                  </div>`;

    topCatGrid.innerHTML += itemCard;
  });
}

// CHART SETUP
const ctx = document.getElementById("myChart").getContext('2d');
let myLineChart = null;

function setupChart(filterType, reportData) {
    let labels = [];
    let dataPoints = [];

    const orders = reportData.orders; // Get order data from API response

    if (filterType === "daily") {
        labels = ["Today"];
        dataPoints = [orders.length]; 
    } else if (filterType === "weekly") {
        labels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        dataPoints = new Array(7).fill(0);

        orders.forEach(order => {
            let day = new Date(order.createdAt).getDay();
            dataPoints[day]++;
        });
    } else if (filterType === "monthly") {
        labels = Array.from({ length: 31 }, (_, i) => i + 1);
        dataPoints = new Array(31).fill(0);

        orders.forEach(order => {
            let day = new Date(order.createdAt).getDate() - 1;
            dataPoints[day]++;
        });
    } else if (filterType === "yearly") {
        labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        dataPoints = new Array(12).fill(0);

        orders.forEach(order => {
            let month = new Date(order.createdAt).getMonth();
            dataPoints[month]++;
        });
    }

    // Destroy previous chart instance to avoid duplicates
    if (myLineChart) {
        myLineChart.destroy();
    }

    myLineChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Total Orders",
                    data: dataPoints,
                    borderColor: "blue",
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Time Period",
                        font: { size: 16, weight: "bold" },
                        color: "darkblue"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Orders Count",
                        font: { size: 16, weight: "bold" },
                        color: "darkblue"
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function orderDetails(orders){
    document.getElementById('total-sales').textContent = orders.filter(odr => odr.orderStatus == "Delivered").length;
    document.getElementById('total-orders').textContent = orders.length;
    document.getElementById('avg-order-value').textContent = (orders.reduce((acc,odr) => {
        acc += (odr.orderStatus == "Delivered") ? odr.totalAmount : 0;
        return acc;
    }, 0)/orders.length).toFixed(2);
}