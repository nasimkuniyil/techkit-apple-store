const inputFields = document.querySelectorAll("input");
const description = document.querySelector("#description");
const productForm = document.querySelector("#productForm");
const formSelect = document.querySelectorAll(".form-select");

let previewImg = document.querySelectorAll(".preview-image").length;

let removedImages = [];

productForm.addEventListener("submit", handleSubmit);

// Image Preview
function handleImageUpload(input, index) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    const preview = document.getElementById(`preview-${index}`);

    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
      input.parentElement.querySelector("i").style.display = "none";
      input.parentElement.querySelector("p").style.display = "none";
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function handleCancel() {
  if (confirm("Are you sure you want to cancel? All changes will be lost.")) {
    window.history.back();
  }
}

// Functions
// function handleSubmit(e) {
//   e.preventDefault();

//   if (imageUploadBox + previewImg < 3) {
//     return alert("Add 3 images");
//   }

//   inputFields.forEach((inp) => {
//     if (!inp.value) {
//       if (inp.type == "file") {
//         showErrorMessage(inp, "file");
//       } else {
//         showErrorMessage(inp, "text");
//       }
//     }
//   });

//   formSelect.forEach((select) => {
//     if (!select.value) showErrorMessage(select, "dropdown");
//   });

//   if (description.textLength == 0) {
//     showErrorMessage(description, "file");
//   }
// }

//Error message
function showErrorMessage(elem, type) {
  const text = type == "file" ? "Add" : type == "dropdown" ? "Select" : "Enter";

  const errText = document.createElement("p");
  errText.textContent = `${text} ${elem.name}`;
  errText.classList.add("err-text");
  elem.parentNode.classList.add("err-text-parent");
  elem.parentNode.appendChild(errText);
}

// --- NEW CODES --- //
let currentCropper = null;
let currentImageIndex = null;

// Initialize modal functionality
const modal = document.getElementById("cropperModal");
const closeBtn = document.querySelector(".close-modal");
const cropperImage = document.getElementById("cropperImage");
const cropBtn = document.getElementById("cropImage");
const cancelBtn = document.getElementById("cancelCrop");

// Image manipulation controls
document.getElementById("rotateLeft").addEventListener("click", () => {
  currentCropper.rotate(-90);
});

document.getElementById("rotateRight").addEventListener("click", () => {
  currentCropper.rotate(90);
});

document.getElementById("flipHorizontal").addEventListener("click", () => {
  currentCropper.scaleX(currentCropper.getData().scaleX * -1);
});

document.getElementById("flipVertical").addEventListener("click", () => {
  currentCropper.scaleY(currentCropper.getData().scaleY * -1);
});

document.getElementById("zoomIn").addEventListener("click", () => {
  currentCropper.zoom(0.1);
});

document.getElementById("zoomOut").addEventListener("click", () => {
  currentCropper.zoom(-0.1);
});

// Update handleImageUpload function
function handleImageUpload(input, index) {
  if (input.files && input.files[0]) {
    const file = input.files[0];

    try {
      validateImage(file);

      const reader = new FileReader();
      reader.onload = function (e) {
        currentImageIndex = index;
        cropperImage.src = e.target.result;
        modal.style.display = "block";

        // Destroy existing cropper if any
        if (currentCropper) {
          currentCropper.destroy();
        }

        // Initialize new cropper
        currentCropper = new Cropper(cropperImage, {
          aspectRatio: 1,
          viewMode: 2,
          dragMode: "move",
          autoCropArea: 1,
          restore: false,
          guides: true,
          center: true,
          highlight: false,
          cropBoxMovable: true,
          cropBoxResizable: true,
          toggleDragModeOnDblclick: false,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert(error.message);
      input.value = "";
    }
  }
}

// Handle crop button click
cropBtn.addEventListener("click", () => {
  if (currentCropper) {
    const canvas = currentCropper.getCroppedCanvas({
      width: 600,
      height: 600,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    canvas.toBlob((blob) => {
      // Create preview
      const preview = document.getElementById(`preview-${currentImageIndex}`);
      preview.src = canvas.toDataURL();
      preview.style.display = "block";

      // Store cropped image
      const file = new File([blob], `image-${currentImageIndex}.jpg`, {
        type: "image/jpeg",
      });
      croppedImages[`image${currentImageIndex + 1}`] = file;

      // Hide upload icons
      const uploadBox = preview.closest(".image-upload-box");
      const icons = uploadBox.querySelectorAll("i, p");
      icons.forEach((icon) => (icon.style.display = "none"));

      // Close modal
      closeModal();
    }, "image/jpeg");
  }
});

// Close modal functions
function closeModal() {
  modal.style.display = "none";
  if (currentCropper) {
    currentCropper.destroy();
    currentCropper = null;
  }
}

closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

// Close modal if clicking outside
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// -------  codes
// Add this at the top with your other variables
let croppedImages = {};

// Add this validation function
function validateImage(file) {
  // Check file type
  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Please upload a valid image file (JPEG, PNG, or GIF)");
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error("Image size should be less than 5MB");
  }

  return true;
}

//  ----- codes ----
async function handleSubmit(e) {
  e.preventDefault();
  let hasError = false;

  // Validate inputs
  inputFields.forEach((inp) => {
    if (!inp.value && inp.type !== "file") {
      showErrorMessage(inp, "text");
      hasError = true;
    }
  });

  formSelect.forEach((select) => {
    if (!select.value) {
      showErrorMessage(select, "dropdown");
      hasError = true;
    }
  });

  if (description.textLength == 0) {
    showErrorMessage(description, "text");
    hasError = true;
  }

  if (hasError) return;

  if(validateImageQty()) return;

  try {
    // Create FormData and append all fields
    const formData = new FormData();
    formData.append(
      "product_name",
      document.getElementById("product-name").value
    );
    formData.append("description", description.value);
    formData.append(
      "category",
      document.getElementById("category-select").value
    );
    formData.append("color", document.getElementById("color-select").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("quantity", document.getElementById("quantity").value);

    // Append cropped images
    Object.keys(croppedImages).forEach((key) => {
      formData.append("images", croppedImages[key]);
    });

    // Append removed images
    removedImages.forEach(id=>{
      formData.append("removedImages[]", id);
    })

    const url = productForm.action

    // Send data to backend
    const response = await fetch(url, {
      method: "PUT",
      body: formData,
    });
    if(!response.ok){
      alert('something went wrong')
    }
    window.location.href = '/admin/products'
  } catch (error) {
    console.error("Error saving product:", error);
    alert("Failed to save product. Please try again.");
  }
}

// ------ code m -----
function validateImageQty() {
  const imageUploadBox = document.querySelectorAll(".image-upload-box");
  let imguploadQty = 0;
  imageUploadBox.forEach(n =>{
    const a = n.querySelector('input');
    if(!a.value) return;
    imguploadQty+=1;
  })
  const previewImg = document.querySelectorAll(".preview-image").length;

  if (imguploadQty + previewImg < 3) {
    alert("Add 3 images");
    return true
  }
}

function addNewImageSection(index) {
  const imageUploadContainer = document.querySelector(
    ".image-upload-container"
  );
  const uploadHtml = `<div class="image-upload-box">
    <i class="fas fa-cloud-upload-alt"></i>
    <p>Main Image</p>
    <input
    id="image${index}"
    name="image"
    type="file"
    accept="image/*"
    onchange="handleImageUpload(this, ${index})"
    />
    <img class="image-preview" id="preview-${index}" />
    </div>`;

  imageUploadContainer.innerHTML += uploadHtml;
}

for (let i = previewImg; i < 3; i++) {
  addNewImageSection(i);
}

function removeExistingImage(event, id, index) {
  removedImages.push(id);
  event.target.parentNode.remove();
  addNewImageSection(parseInt(index));
}
