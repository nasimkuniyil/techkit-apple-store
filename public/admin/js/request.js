function cancellOrder(event, id){
    console.log("complete order cancellation : ",event.target.value);
    const url = `/admin/api/order/cancelled?id=${id}`
    fetch(url,{method:'PUT'})
    .then(response=>{
        window.location.href = response.url
    })
    .catch()
}
function returnOrder(event, orderId, productId){
    console.log("complete order return : ",event.target.value);
    const url = `/admin/api/prodcut/return?orderId=${orderId}&productId=${productId}&status=returned`
    fetch(url,{method:'PUT'})
    .then(response=>{
        window.location.href = response.url
    })
    .catch()
}