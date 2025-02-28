const confirmModal = document.getElementById('confirm-modal');

const okBtn = document.querySelector('.confirm-ok-btn');
const cancelBtn = document.querySelector('.confirm-cancel-btn');


function openPopup() {
    confirmModal.classList.add('visible');  
    okBtn.addEventListener('click', ()=>)
}

function closePopup() {
    confirmModal.classList.remove('visible');
}

function confirmRequest(){
    const h = document.createElement('h3');
        h.textContent = 'Confirmed.'
        document.querySelector('main').appendChild(h);

    closePopup()
}

function confirmInput(){
    openPopup();
    return false;
}