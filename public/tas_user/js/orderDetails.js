fetchOrderData()
// fetch order data
function fetchOrderData(){
  const url = `/api/order/view${window.location.search}`;
  axios.get(url)
  .then(response => {
    renderOrderData(response.data.order)
  })
  .catch(err=>{
    console.log('order fetch data error : ',err)
  })

}

// render order items
function renderOrderData(order){
  document.querySelector('.order-title').textContent = order.orderId;
  document.querySelector('.order-date').textContent = "Ordered on "+ order.createdAt.toString().split('T')[0];
  
  const orderHeader = document.querySelector('.order-header')
  if(order.paymentStatus && order.paymentStatus != 'Success'){
    const paymentBtn  = document.createElement('button');
    paymentBtn.classList.add('button');
    paymentBtn.textContent = 'Payment';
    paymentBtn.addEventListener('click', ()=>payNow(order));
    orderHeader.appendChild(paymentBtn)
  }else if(order.orderStatus == 'Delivered'){
    const invoiceDownloadBtn  = document.createElement('button');
    invoiceDownloadBtn.classList.add('button');
    invoiceDownloadBtn.textContent = 'Download invoice';
    invoiceDownloadBtn.addEventListener('click', ()=>downloadInvoice(order));
    orderHeader.appendChild(invoiceDownloadBtn)
  }else if(order.orderStatus == 'Cancelled'){
    const orderCancelTxt = document.createElement('p');
    orderCancelTxt.classList.add('order-cancle-text')
    orderCancelTxt.textContent = "Order Cancelled" ;
    orderHeader.appendChild(orderCancelTxt)
  }else if(order.cancelReason){
    const orderCancelTxt = document.createElement('p');
    orderCancelTxt.classList.add('order-cancle-text')
    orderCancelTxt.textContent = "Order cancellation requested" ;
    orderHeader.appendChild(orderCancelTxt)
  }else if(order.orderStatus == 'Pending' && !order.cancelReason){
    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('button', 'cancel');
    cancelBtn.addEventListener('click', ()=> showCancellationModal(order._id, 'order'))
    cancelBtn.textContent = 'Cancel Order'
    orderHeader.appendChild(cancelBtn)
  }

  const deliveryProgress = document.querySelector('.delivery-progress');

 if(order.orderStatus !== 'Cancelled'){
    const progressContent = `<div class="progress-header">
                  <div>
                    <div class="delivery-date">Arriving Tuesday, January 25</div>
                    <div class="tracking-number">
                      Tracking Number: 1Z999AA1234567890
                    </div>
                  </div>
                </div>
                
                  <div class="progress-bar">
                    <div class="progress-step ${order.orderStatus == 'Pending' && 'step-active'}" id="pending">
                      <div class="step-dot"></div>
                      <div class="step-label">Order Placed</div>
                    </div>
                    <div class="progress-step ${ order.orderStatus == 'Processing' && 'step-active'}" id="processing">
                      <div class="step-dot"></div>
                      <div class="step-label">Processing</div>
                    </div>
                    <div class="progress-step ${ order.orderStatus == 'Shipped' && 'step-active'}" id="shipped">
                      <div class="step-dot"></div>
                      <div class="step-label">Shipped</div>
                    </div>
                    <div class="progress-step ${ order.orderStatus == 'Delivered' && 'step-active'}" id="delivered">
                      <div class="step-dot"></div>
                      <div class="step-label">Delivered</div>
                    </div>
                  </div>`

      deliveryProgress.innerHTML = progressContent
    }else{
    deliveryProgress.innerHTML = `<div class="status-cancelled ">Order Cancelled</div>`
  }

  const itemsSection = document.querySelector('.items-section');
  itemsSection.innerHTML = "";
  if(order.products){

    order.products.forEach(prod=>{
      const returnShowBtn = `<button class="button return" onclick="showReturnModal('${prod.productId._id}', '${order._id}')">Return</button>`;
      const itemContent = ` <div class="item-card">
                    <div class="item-image">
                      <img src="${prod.productId.images[0].url}" alt="">
                    </div>
                    <div class="item-details">
                      <div class="item-name">
                        ${prod.productId.product_name} - ${prod.productId.color}
                      </div>
                      <div class="item-meta">
                        <span>Qty: ${prod.quantity}</span>
                        <span>₹${prod.productId.price}</span>
                      </div>
                    </div>
                    <div class="button-container">
                     ${  (prod.isReturn) ? "Returned" : (prod.returnReason) ? "Return requested" : (order.orderStatus == 'Delivered' && new Date(order.updatedAt).getTime() + 7 * 24 * 60 * 60 * 1000 >= new Date().getTime()) ? returnShowBtn :""}
                    </div>                    
                  </div>`

                  itemsSection.innerHTML += itemContent;
    })
  }

  // shipping
  const shippingDetails  = document.querySelector('.shipping-details');
  shippingDetails.innerHTML = ""
  const shippingContent = `<div class="detail-group">
                    <div class="detail-label">Shipping Address</div>
                    <div class="detail-value">
                      ${order.addressInfo.name}<br />
                      ${order.addressInfo.address}<br />
                      ${order.addressInfo.city}, ${order.addressInfo.landmark}<br />
                      ${order.addressInfo.state}
                    </div>
                  </div>
                  <div class="detail-group">
                    <div class="detail-label">Shipping Method</div>
                    <div class="detail-value">${order.paymentInfo}</div>
                  </div>
                  <div class="detail-group">
                    <div class="detail-label">Contact Information</div>
                    <div class="detail-value">
                      ${order.userId.email}<br />
                      ${order.addressInfo.mobile}
                    </div>
                  </div>`

              shippingDetails.innerHTML = shippingContent;


  const priceSection = document.querySelector('.price-section');
  priceSection.innerHTML = ""
  const priceContent = `<div class="price-row">
                  <span>Subtotal</span>
                  <span>₹ ${order.totalAmount}</span>
                </div>
                <div class="price-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div class="total-row">
                  <span>Total</span>
                  <span>₹ ${order.totalAmount}</span>
                </div>`

  priceSection.innerHTML = priceContent;
}





// BEFORE
const progressBar = document.querySelector(".progress-bar");

const obj = {
  0: "cancelled",
  1: "pending",
  2: "processing",
  3: "shipped",
  4: "delivered",
};

for (key in obj) {
  
  if (document.getElementById(obj[key])?.classList.contains("step-active")) {
    progressBar.style.setProperty("--progress-width", key * 25 + "%");
    break;
  }
  document.getElementById(obj[key])?.classList.add("step-completed");
}

window.addEventListener("click", (e) => {});

let id,type,orderId;

function showCancellationModal(productId, cancelType) {
  id= productId
  type = cancelType
  
  selectedProductId = productId;
  document.getElementById("cancellationModal").style.display = "flex";
}

function closeCancelModal() {
  document.getElementById("cancellationModal").style.display = "none";
  document.getElementById("cancellationReason").value = "";
  document.getElementById("cancellationNotes").value = "";
}

function confirmCancellation() {
  const reason = document.getElementById("cancellationReason").value;
  if (!reason) {
    alert("Please select a cancellation reason");
    return;
  }

  const url = `/api/cancel-${type}`
  const options = {
    method : 'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({id,reason})
  }
  fetch(url,options)
  .then(response => {
    if(response.ok){
      window.location.href = `/order/view?id=${id}`
    }
  })
  .catch(err=>alert('somethin error occured.'))
  closeCancelModal();
}

// return
  const returnModal = document.getElementById("returnModal");
  const openModalBtn = document.getElementById("openModal");
  const closeModalBtn = document.getElementById("closeModal");
  const submitBtn = document.getElementById("submitReturn");
  const returnReason = document.getElementById("returnReason");

  let returnObj = {}

  // Open modal
  function showReturnModal(productId, orderId){
    returnObj.productId = productId;
    returnObj.orderId = orderId;
    returnModal.style.display = "flex";
  }

  // Close modal
  closeModalBtn.addEventListener("click", function () {
      returnModal.style.display = "none";
  });

  // Close modal when clicking outside content
  window.addEventListener("click", function (event) {
      if (event.target === returnModal) {
          returnModal.style.display = "none";
      }
  });

  // Handle submit
  submitBtn.addEventListener("click", function () {
      if (returnReason.value) {
          const url = `/api/return-product`
          const options = {
            method : 'POST',
            headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify({orderId:returnObj.orderId, productId:returnObj.productId,reason:returnReason.value})
          }
          fetch(url,options)
          .then(response => {
            if(response.ok){
              window.location.reload()
            }
          })
          .catch(err=>alert('somethin error occured.'))
          returnModal.style.display = "none";
      } else {
          alert("Please select a return reason.");
      }
  });


// DOWNLOAD INVOICE
function downloadInvoice(order) {
  const { jsPDF } = window.jspdf;
  generateInvoice();

  function generateInvoice() {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Invoice", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Invoice Number: #12345", 20, 40);
    doc.text(`Date: ${order.updatedAt.toString().split("T")[0]}`, 20, 50);
    doc.text("Bill To:", 20, 60);
    doc.text(`${order.addressInfo.name}`, 20, 70);
    doc.text(`${order.addressInfo.address}, ${order.addressInfo.city}, ${order.addressInfo.state}`, 20, 80);

    doc.line(20, 90, 190, 90);

    doc.text("Item", 20, 100);
    doc.text("Qty", 100, 100);
    doc.text("Price", 140, 100);
    doc.text("Total", 170, 100);

    doc.line(20, 105, 190, 105);

    let yPos = 115; // Start position for product rows

    order.products.forEach(prod => {
      doc.text(`${prod.productId.product_name}`, 20, yPos);
      doc.text(`${prod.quantity}`, 105, yPos);
      doc.text(`${prod.productId.price}`, 140, yPos);
      doc.text(`${ (prod.isReturn) ? 'returned' : prod.productId.price * prod.quantity}`, 170, yPos);

      yPos += 10; // Increase Y-position for next row
    });

    doc.line(20, yPos, 190, yPos);

    doc.text("Subtotal:", 140, yPos + 10);
    doc.text(`₹${order.totalAmount}`, 170, yPos + 10);
    doc.text("Total:", 140, yPos + 30);
    doc.text(`₹${order.totalAmount}`, 170, yPos + 30);

    doc.line(20, yPos + 40, 190, yPos + 40);

    doc.setFontSize(10);
    doc.text("Thank you for your purchase!", 20, yPos + 55);

    doc.save("invoice.pdf");
  }
}


async function payNow(order){
        const totalAmount = window.localStorage.getItem('totalAmount');

        // Create order by calling the server endpoint
        const response = await fetch("/api/online-payment?orderId="+order._id, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            totalAmount : order.totalAmount,
            currency: "INR",
            receipt: "receipt#1",
            notes: {},
          }),
        });

        if(!response.ok){
          window.location.href = '/orders'
        }

        const rzpOrder = await response.json();

        // Open Razorpay Checkout
        const options = {
          key: "rzp_test_hGYKC7nv8aVuxX",
          amount: totalAmount * 100,
          currency: "INR",
          order_id: rzpOrder.id,
          callback_url: "https://techkit.site/api/online-payment/success?payment=onlinePayment&orderId="+order._id,
        };

        const rzp = new Razorpay(options);
        rzp.open();
      
        rzp.on('payment.failed', function (response) {
          
          // Optionally, send failure details to your backend to log and update the payment status
          fetch('/payment/failure?orderId='+order._id``, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              errorDescription: response.error.description,
              orderId: rzpOrder.id, // The order ID that you created on the backend
            }),
          });
        })
}