function cancellOrder(event, id){
    const url = `/admin/api/order/cancelled?id=${id}`
    fetch(url,{method:'PUT'})
    .then(response=>{
        window.location.href = response.url
    })
    .catch()
}
function returnOrder(event, orderId, productId){
    const url = `/admin/api/prodcut/return?orderId=${orderId}&productId=${productId}&status=returned`
    fetch(url,{method:'PUT'})
    .then(response=>{
        window.location.href = response.url
    })
    .catch()
}