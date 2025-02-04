// Initialize charts
// const salesCtx = document.getElementById('salesChart').getContext('2d');
const productsCtx = document.getElementById('productsChart').getContext('2d');

let reportData;
let productsChart;

//get sales data
function getSalesReport (period){
    if(productsChart){
        productsChart.destroy()
    }
    let url = `/admin/api/get-order-data`;
    if(period){
        url+='?period='+period
    };

        fetch(url)
        .then(response =>{
            if(!response.ok){
                throw new Error('Error occured when fetching sales report'); 
            }
            return response.json();
        })
        .then(result =>{
            console.log('response data : ', result);
            reportData = result.report;
            updateReport(result.report, result.topProducts);
        })

}

getSalesReport();

function generateReport() {
    // Get jsPDF from the window object if using CDN
    const { jsPDF } = window.jspdf;

    // Create a new jsPDF document
    const doc = new jsPDF();

    // Set Document Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Sales Report", 20, 20);

    // Add some spacing
    doc.setFontSize(12);
    doc.text("Date: " + reportData.date, 20, 30);

    // Draw a line separator
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Add the sales report data
    doc.text("Total Orders: " + reportData.totalOrders, 20, 50);
    doc.text("Total Revenue: ₹" + reportData.totalRevenue, 20, 60);
    doc.text("Total Products Sold: " + reportData.totalProductsSold, 20, 70);
    doc.text("Average Order Value: ₹" + reportData.averageOrderValue.toFixed(2), 20, 80);

    // Finalize the PDF and save
    doc.save("Sales_Report_" + reportData.date + ".pdf");
}

//update report
function updateReport(data,topProducts){
    document.getElementById('total-sales').textContent = "₹ "+data.totalRevenue;
    document.getElementById('total-orders').textContent = data.totalOrders;
    document.getElementById('avg-order-value').textContent = "₹ "+data.averageOrderValue;
    // document.getElementById('conversion-rate').textContent = data.conversionRate;

    productsChart = new Chart(productsCtx, {
        type: 'bar',
        data: {
            labels: topProducts.map(prod=>prod.productName),
            datasets: [{
                label: 'Sales',
                data: topProducts.map(prod=>prod.totalQuantitySold),
                backgroundColor: '#0071e3'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            }
        }
    });
}

// const salesChart = new Chart(salesCtx, {
//     type: 'line',
//     data: {
//         labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//         datasets: [{
//             label: 'Sales ($)',
//             data: [5200, 6300, 4800, 7200, 8100, 7400, 6200],
//             borderColor: '#0071e3',
//             tension: 0.4
//         }]
//     },
//     options: {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: 'top',
//             }
//         }
//     }
// });



// Filter buttons functionality
function updatePeriod(period) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    if (period !== 'custom') {
        document.getElementById('customDateInputs').style.display = 'none';
    }
    // Update charts and data based on selected period
    updateData(period);
}

function toggleCustomDate() {
    const customInputs = document.getElementById('customDateInputs');
    customInputs.style.display = customInputs.style.display === 'none' ? 'flex' : 'none';
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function updateData(period) {
    getSalesReport(period);
    console.log('Updating data for period:', period);
}

// Generate sample table data
function generateTableData() {
    const tbody = document.getElementById('reportTable');
    const dates = ['2024-01-28', '2024-01-27', '2024-01-26', '2024-01-25', '2024-01-24'];
    
    dates.forEach(date => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${date}</td>
            <td>${Math.floor(Math.random() * 100 + 150)}</td>
            <td>$${(Math.random() * 5000 + 3000).toFixed(2)}</td>
            <td>$${(Math.random() * 20 + 30).toFixed(2)}</td>
            <td>${(Math.random() * 2 + 1).toFixed(2)}%</td>
        `;
        tbody.appendChild(tr);
    });
}

// Initialize table data
generateTableData();