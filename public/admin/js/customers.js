//Coupon add modal
let userId = null;
function openCouponModal(id) {
  document.getElementById('modalOverlay').style.display = 'block';
  document.body.style.overflow = 'hidden';
  userId = id
}

function closeCouponModal() {
  document.getElementById('modalOverlay').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function applyCoupon() {
  const selectedCoupon = document.querySelector('input[name="coupon"]:checked').value;
  const url = `/admin/api/coupon/provide?userId=${userId}&couponId=${selectedCoupon}`
  const options = {
    method:'POST'
  }
  if (selectedCoupon) {
    fetch(url, options)
    .then(response=>{
      if(response.ok){
        closeCouponModal();
        window.location.reload();
      }
    })
    .catch(err=>{
      console.log('apply coupon error : ', err)
    })
  } else {
      showFlashMessage({success:false,message:'Please select a coupon first.'});
  }
}

// Close modal when clicking outside
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) {
      closeCouponModal();
  }
});

//Block user
function blockUser(id) {
  if (confirm("Are you sure you want to block this user?")) {
    const url = `/admin/api/user/block?id=${id}`;
    const options = { method: "PUT" };
    fetch(url, options)
      .then((response) => (window.location.href = response.url))
      .catch((err) => console.log("something happend in add category"));
  }
}

//Unblock user
function unblockUser(id) {
  if (confirm("Block this user ?")) {
    const url = `/admin/api/user/unblock?id=${id}`;
    const options = { method: "PUT" };
    fetch(url, options)
      .then((response) => (window.location.href = response.url))
      .catch((err) => console.log("something happend in add category"));
  }
}
