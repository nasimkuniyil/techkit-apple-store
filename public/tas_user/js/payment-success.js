function showOrderConfirmation(orderData) {
  console.log("order data : ", orderData);

  const confirmationContent = document.querySelector(
    "#orderConfirmModal .modal-content"
  );
  confirmationContent.innerHTML = `<div class="success-container">
  <div class="success-content">
    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
      <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
    </svg>
    
    <h1>Thank you for your order.</h1>
    <p class="order-number">Order #2458712</p>
    <p class="message">We'll send you a shipping confirmation email when your order ships.</p>
    
    <div class="delivery-info">
      <p class="delivery-date">Arrives by Wed, Feb 4</p>
    </div>
    
    <a href="/orders" class="continue-btn">Continue Shopping</a>
  </div>
</div>`;
  orderConfirmModal.classList.add("active");
}



  //PLACE ORDER
  function addOrder() {
    const {products, addressId, paymentInfo} = window.localStorage;

    if(paymentInfo == 'onlinePayment'){
      window.location.href = '/orders'
    }else{

    const url = `/api/add-order`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({products, addressId, paymentInfo}),
    };
    fetch(url, options)
      .then((response) => {
        console.log("add order res : ", response);
        const orderData = {
            products : JSON.parse(products),
            addressId,
            paymentInfo
        }
        showOrderConfirmation(orderData);
      })
      .catch((err) => console.log("add order error : ", err));
    }
  }
