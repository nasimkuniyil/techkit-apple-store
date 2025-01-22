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

function closeModal() {
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
  closeModal();
}