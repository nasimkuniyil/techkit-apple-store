document.addEventListener("DOMContentLoaded", () => {
  const addressModal = document.getElementById("address-modal");
  const addressAddBtn = document.getElementById("address-add-btn");
  const addressCancelBtn = document.getElementById("address-cancel-btn");
  const addressForm = document.getElementById("address-form");
  const addressList = document.getElementById("address-list");

  //Get address
  fetch("/api/address")
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.message);
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      addAddressCard(data);
      console.log("address data :", data);
    })
    .catch((error) => console.log("error : ", error));

  // Open modal and add event listener for form
  addressAddBtn.addEventListener("click", () => {
    addressModal.classList.add("active");

    addressForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const addressData = {
        name: document.getElementById("name").value,
        mobile: document.getElementById("mobile").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        country: document.getElementById("country").value,
        pincode: document.getElementById("pincode").value,
        landmark: document.getElementById("landmark").value,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      };

      const url = "/api/add-address";

      fetch(url, options)
        .then((response) => {
          window.location.href = response.url;
        })
        .catch((error) => console.log("error : ", error));

      addAddressCard(addressData);
      addressModal.classList.remove("active");
      addressForm.reset();
    });
  });

  // Close modal
  addressCancelBtn.addEventListener("click", () => {
    addressModal.classList.remove("active");
    addressForm.reset();
  });

  // Handle form submission

  // Add new address card
  function addAddressCard(data) {
    data.forEach((item) => {
      const addressCard = document.createElement("div");
      addressCard.className = "address-card";
      addressCard.innerHTML = `
            <div class="address-card-content">
                <h3 class="address-name">${item.address.name}</h3>
                <p class="address-line">${item.address.mobile}</p>
                <p class="address-line">${item.address.address}</p>
                <p class="address-line">${item.address.city}, ${item.address.state} ${item.address.country}</p>
                <p class="address-line">${item.address.pincode}</p>
                <p class="address-line">${item.address.landmark}</p>
            </div>
            <div class="address-card-actions">
                <button class="address-btn-secondary address-edit-btn">Edit</button>
                <button class="address-btn-secondary address-delete-btn">Delete</button>
            </div>
        `;

      // Add delete functionality
      const deleteBtn = addressCard.querySelector(".address-delete-btn");
      deleteBtn.addEventListener("click", async () => {
        fetch(`/api/remove-address?addressId=${address._id}`, {
          method: "DELETE",
        })
          .then((response) => {
            // alert('removed success')
            return (window.location.href = response.url);
          })
          .catch((err) => console.log("delete error : ", err));
      });

      // Add edit functionality
      const editBtn = addressCard.querySelector(".address-edit-btn");
      editBtn.addEventListener("click", () => {
        addressModal.classList.add("active");
        document.getElementById("name").value = address.name;
        document.getElementById("mobile").value = address.mobile;
        document.getElementById("address").value = address.address;
        document.getElementById("city").value = address.city;
        document.getElementById("state").value = address.state;
        document.getElementById("country").value = address.country;
        document.getElementById("pincode").value = address.pincode;
        document.getElementById("landmark").value = address.landmark;

        addressForm.addEventListener("submit", (e) => {
          e.preventDefault();

          const addressData = {
            name: document.getElementById("name").value,
            mobile: document.getElementById("mobile").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            country: document.getElementById("country").value,
            pincode: document.getElementById("pincode").value,
            landmark: document.getElementById("landmark").value,
          };

          const options = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(addressData),
          };

          const url = `/api/edit-address?addressId=${address._id}`;

          fetch(url, options)
            .then((response) => {
              window.location.href = response.url;
            })
            .catch((error) => console.log("error : ", error));

          addressForm.reset();
        });
      });

      addressList.appendChild(addressCard);
    });
  }
});
