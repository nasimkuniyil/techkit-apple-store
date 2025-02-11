
function blockCoupon(id){
    axios.put('/admin/api/coupon/block?id='+id)
    .then(response=>{
        console.log("blocked : ",response)
        showFlashMessage(response.data);
       setTimeout(() => {
        window.location.reload()
       }, 1500);
    })
    .catch(err=>{
        console.log('coupon block error message: ',err);
    })
}

function unblockCoupon(id){
    axios.put('/admin/api/coupon/unblock?id='+id)
    .then(response=>{
        console.log("unblocked : ",response)
        showFlashMessage(response.data);
        setTimeout(() => {
            window.location.reload()
           }, 1500);
    })
    .catch(err=>{
        console.log('coupon block error message: ',err);
    })
}