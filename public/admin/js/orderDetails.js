const statusDropdown =  document.querySelector('.status-select');

function changeOrderStatus(event, id){
    console.log("complete order cancellation : ",event.target.value);
    const url = `/admin/api/order/${event.target.value}?id=${id}`
    fetch(url,{method:'PUT'})
    .then(response=>{
        window.location.href = response.url
    })
    .catch()
}