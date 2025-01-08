document.addEventListener('DOMContentLoaded', () => {
    const addressModal = document.getElementById('address-modal');
    const addressAddBtn = document.getElementById('address-add-btn');
    const addressCancelBtn = document.getElementById('address-cancel-btn');
    const addressForm = document.getElementById('address-form');
    const addressList = document.getElementById('address-list');

    // Open modal
    addressAddBtn.addEventListener('click', () => {
        addressModal.classList.add('active');
    });

    // Close modal
    addressCancelBtn.addEventListener('click', () => {
        addressModal.classList.remove('active');
        addressForm.reset();
    });

    // Handle form submission
    addressForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const addressData = {
            name: document.getElementById('address-name').value,
            line1: document.getElementById('address-line1').value,
            line2: document.getElementById('address-line2').value,
            city: document.getElementById('address-city').value,
            state: document.getElementById('address-state').value,
            zip: document.getElementById('address-zip').value
        };

        addAddressCard(addressData);
        addressModal.classList.remove('active');
        addressForm.reset();
    });

    // Add new address card
    function addAddressCard(data) {
        const uid = Date.now();
        const addressCard = document.createElement('div');
        addressCard.className = 'address-card';
        
        addressCard.innerHTML = `
            <div class="address-card-content" id=${uid}>
                <h3 class="address-name">${data.name}</h3>
                <p class="address-line">${data.line1}</p>
                ${data.line2 ? `<p class="address-line">${data.line2}</p>` : ''}
                <p class="address-line">${data.city}, ${data.state} ${data.zip}</p>
            </div>
            <div class="address-card-actions">
                <button class="address-btn-secondary address-edit-btn">Edit</button>
                <button class="address-btn-secondary address-delete-btn">Delete</button>
            </div>
        `;

        // Add delete functionality
        const deleteBtn = addressCard.querySelector('.address-delete-btn');
        deleteBtn.addEventListener('click', () => {
            addressCard.remove();
        });

        // Add edit functionality
        const editBtn = addressCard.querySelector('.address-edit-btn');
        editBtn.addEventListener('click', () => {
            addressModal.classList.add('active');
            document.getElementById('address-name').value = data.name
            document.getElementById('address-line1').value = data.line1
            document.getElementById('address-line2').value = data.line2
            document.getElementById('address-city').value = data.city
            document.getElementById('address-state').value = data.state
            document.getElementById('address-zip').value = data.zip
        });

        addressList.appendChild(addressCard);
    }
});