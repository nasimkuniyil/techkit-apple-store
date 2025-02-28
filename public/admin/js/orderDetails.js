const statusDropdown =  document.querySelector('.status-select');

function changeOrderStatus(event, id){
    const url = `/admin/api/order/${event.target.value}?id=${id}`
    fetch(url,{method:'PUT'})
    .then(response=>{
        window.location.reload()
    })
    .catch()
}
