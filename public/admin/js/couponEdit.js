
function couponEdit(){
    const data  = {
        discountValue:document.getElementById('discountValue').value,
        expirationDate:document.getElementById('expirationDate').value,
        minimumPurchase:document.getElementById('minPurchase').value,
        usageLimit:document.getElementById('usageLimit').value,
    }

    axios.put('/admin/api/coupon/edit'+window.location.search, data)
    .then(response=>{
        console.log("blocked : ",response)
        showFlashMessage(response.data);
        window.location.href = '/admin/coupons'
    })
    .catch(err=>{
        showFlashMessage(err.response.data);
        console.log('coupon block error message: ',err);
    });
}