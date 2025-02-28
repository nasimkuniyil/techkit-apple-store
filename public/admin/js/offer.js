const blockOffer = (id)=>{
    axios.get(`/admin/api/offer/block?id=${id}`)
    .then(response =>{
        showFlashMessage(response.data);
        setTimeout(() => {
            window.location.reload()
        }, 1100);
    })
    .catch(err =>{
        showFlashMessage(err)
        console.log('offer block error : ', err);
    })
    
}

const unblockOffer = (id)=>{
    axios.get(`/admin/api/offer/unblock?id=${id}`)
    .then(response =>{
        showFlashMessage(response.data)
        setTimeout(() => {
            window.location.reload()
        }, 1100);
    })
    .catch(err =>{
        showFlashMessage(err)
        console.log('offer block error : ', err);
    })

}