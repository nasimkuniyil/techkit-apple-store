let totalProducts = 0;

const timeSelect = document.querySelector('.time-select');

const Url = new URL(`${window.location.origin}/admin/api/report`);
fetchReportData()


timeSelect.addEventListener('change', (event)=>{
  totalProducts = 0
  // event.target.value;
  if(event.target.value != 'custom'){
    Url.searchParams.set("filterType", event.target.value);
    fetchReportData(Url)
  }
})

function fetchReportData(){
  const fetchUrl = Url.pathname+Url.search;
  fetch(fetchUrl) 
  .then(response => response.json())
  .then(data => {
    if (data.success) {

      const tableBody = document.querySelector(".orders-table tbody");
      tableBody.innerHTML = "";
    
      data.orders.forEach(order => {
        totalProducts += order.products.length
        const row = `
          <tr>
            <td>#${order.orderId}</td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>${order.addressInfo.name}</td>
            <td>${order.products.length}</td>
            <td>₹${order.totalAmount.toFixed(2)}</td>
            
          </tr>
        `;
        tableBody.innerHTML += row;
      });

      // setupPagination(data.totalPage, data.currentPage).addEventListener('click', (event)=> paginationFunc(event, Url, ()=>fetchReportData(Url)));

      // Update Summary Cards
      document.querySelector(".summary-cards .summary-card:nth-child(1) .card-value").innerText = data.totalOrders;
      document.querySelector(".summary-cards .summary-card:nth-child(2) .card-value").innerText = `₹${data.totalRevenue.toFixed(2)}`;
      document.querySelector(".summary-cards .summary-card:nth-child(3) .card-value").innerText = totalProducts;
    }
  })
  .catch(err => console.error("Error fetching report data:", err));
}


{/* <td><span class="status completed">Delivered</span></td> */}


// JS PDF
// PDF GENERATOR
// Initialize jsPDF

function generatePDF() {
  const { jsPDF } = window.jspdf;
    // Create new PDF document
    const doc = new jsPDF();
    
    // Get time range
    const timeRange = document.querySelector('.time-select').value;
    
    // Get current summary data
    const totalOrders = document.querySelector(".summary-cards .summary-card:nth-child(1) .card-value").innerText;
    const totalRevenue = document.querySelector(".summary-cards .summary-card:nth-child(2) .card-value").innerText;
    const totalProducts = document.querySelector(".summary-cards .summary-card:nth-child(3) .card-value").innerText;
    
    // Add title
    doc.setFontSize(20);
    doc.text('Store Sales Report', 15, 15);
    
    // Add report details
    doc.setFontSize(12);
    doc.text(`Report Type: ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`, 15, 25);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 32);
    
    // Add summary section
    doc.setFontSize(16);
    doc.text('Summary', 15, 45);
    
    // Add summary cards data
    doc.setFontSize(12);
    doc.text(`Total Orders: ${totalOrders}`, 15, 55);
    doc.text(`Total Revenue: ${totalRevenue}`, 15, 62);
    doc.text(`Total Products Sold: ${totalProducts}`, 15, 69);
    
    // Get table data
    const table = document.querySelector('.orders-table');
    const tableData = [];
    
    // Get headers
    const headers = [];
    table.querySelectorAll('thead th').forEach(header => {
        headers.push(header.textContent);
    });
    
    // Get rows
    table.querySelectorAll('tbody tr').forEach(row => {
        const rowData = [];
        row.querySelectorAll('td').forEach(cell => {
            rowData.push(cell.textContent);
        });
        tableData.push(rowData);
    });
    
    // Add table to PDF
    doc.autoTable({
        head: [headers],
        body: tableData,
        startY: 80,
        theme: 'grid',
        styles: {
            fontSize: 10,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [51, 51, 51], // Dark gray header
            textColor: 255,
            fontSize: 10,
            fontStyle: 'bold',
        },
        columnStyles: {
            0: { cellWidth: 30 }, // Order ID
            1: { cellWidth: 30 }, // Date
            2: { cellWidth: 40 }, // Customer
            3: { cellWidth: 25 }, // Items
            4: { cellWidth: 30 }, // Total
        }
    });
    
    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    }
    
    // Generate filename based on time range and current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `sales-report-${timeRange}-${currentDate}`;
    
    // Save PDF
    doc.save(`${filename}.pdf`);
}

// Add event listener for custom date range
document.querySelector('.time-select').addEventListener('change', function(e) {
    const customDateDiv = document.querySelector('.custom-date');
    customDateDiv.style.display = e.target.value === 'custom' ? 'flex' : 'none';
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');

    Url.searchParams.set("filterType", "custom");
    Url.searchParams.set("startDate", startDate.value);
    Url.searchParams.set("endDate", endDate.value);

    const applyBtn = document.createElement('button');
    applyBtn.classList.add('btn')
    applyBtn.addEventListener('click',()=>fetchReportData(Url))
    applyBtn.textContent = 'Apply'
    customDateDiv.appendChild(applyBtn);

});

