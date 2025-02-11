fetchOrderData()
// fetch order data
function fetchOrderData(){
  const url = `/api/order/view${window.location.search}`;
  axios.get(url)
  .then(response => {
    console.log('order response : ', response);
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
  if(order.orderStatus == 'Cancelled'){
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
                     ${(order.orderStatus == 'Delivered') ? "<button class='button return' onclick='showReturnModal("+prod.productId._id+", "+order._id+")'>Return</button>" :""}
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

  // console.log(value)
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
    }else{
      console.log(response.json())
    }
  })
  .catch(err=>alert('somethin error occured.'))
  closeCancelModal();
}

// return

function showReturnModal(productId, orderId) {
  document.getElementById('return-order-btn').addEventListener('click', ()=> confirmReturn(productId, orderId))
  document.getElementById("returnModal").style.display = "flex";
}
function closeReturnModal() {
  document.getElementById("returnModal").style.display = "none";
  document.getElementById("returnReason").value = "";
  document.getElementById("returnNotes").value = "";
}

function confirmReturn(productId, orderId) {
  const reason = document.getElementById("returnReason").value;
  if (!reason) {
    alert("Please select a return reason");
    return;
  }

  const url = `/api/return-order`
  const options = {
    method : 'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({orderId, productId,reason})
  }
  fetch(url,options)
  .then(response => {
    if(response.ok){
      window.location.href = `/order/view?id=${id}`
    }else{
      console.log(response.json())
    }
  })
  .catch(err=>alert('somethin error occured.'))
  closeReturnModal();
}