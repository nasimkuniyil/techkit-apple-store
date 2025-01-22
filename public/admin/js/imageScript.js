document.addEventListener("DOMContentLoaded", () => {
  const uploadSection = document.querySelector(".upload-section");
  const addMore = document.querySelector(".add-more");
  const cropModal = new bootstrap.Modal(document.getElementById("cropModal"));
  const cropImage = document.getElementById("image");
  const cropBtn = document.getElementById("cropBtn");
  const form = document.getElementById("prod-form");
  const images = document.querySelectorAll(".upload-box input");

  let uploadCount = 0;
  let currentUploadBox = null;
  let cropper = null;

  function handleUpload(uploadBox) {
    const input = uploadBox.querySelector("input");
    const plusIcon = uploadBox.querySelector(".plus-icon");

    uploadBox.addEventListener("click", () => input.click());

    input.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();

        reader.onload = (e) => {
          currentUploadBox = uploadBox;
          showCropModal(e.target.result);
        };

        reader.readAsDataURL(e.target.files[0]);
      }
    });
  }

  function showCropModal(imageSrc) {
    cropImage.src = imageSrc;

    if (cropper) {
      cropper.destroy();
    }

    cropModal.show();

    cropper = new Cropper(cropImage, {
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
  }

  function createRemoveButton() {
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.type = "button";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const uploadBox = e.target.parentElement;
      uploadBox.innerHTML = "";
      uploadBox.appendChild(createFileInput());
      uploadBox.appendChild(createPlusIcon());
      uploadBox.appendChild(createRemoveButton());
      uploadBox.classList.remove("has-image");
      uploadCount--;

      if (uploadCount < 3) {
        addMore.style.display = "none";
      }
    });
    return removeBtn;
  }

  function createFileInput() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.name = "product_images[]";
    return input;
  }

  function createPlusIcon() {
    const plusIcon = document.createElement("div");
    plusIcon.className = "plus-icon";
    return plusIcon;
  }

  cropBtn.addEventListener("click", () => {
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      const croppedImage = croppedCanvas.toDataURL();

      // Convert base64 to blob
      fetch(croppedImage)
        .then((res) => res.blob())
        .then((blob) => {
          // Create a File object
          const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });

          // Create a new FileList
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);

          // Update the input's files
          const input = currentUploadBox.querySelector("input");
          input.files = dataTransfer.files;

          // Update preview
          currentUploadBox.innerHTML = "";
          const img = document.createElement("img");
          img.src = croppedImage;
          img.className = "preview-image";
          currentUploadBox.appendChild(input);
          currentUploadBox.appendChild(img);
          currentUploadBox.appendChild(createRemoveButton());
          currentUploadBox.classList.add("has-image");

          uploadCount++;
          if (uploadCount >= 3) {
            addMore.style.display = "flex";
          }
        });

      cropModal.hide();
      cropper.destroy();
    }
  });

  document.querySelectorAll(".upload-box").forEach(handleUpload);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (images.length < 3) {
      alert("Select minimum 3 images");
      return false;
    }

    const url = window.location.href;

    const formData = new FormData(form);

    // Get all upload boxes with images
    const imageBoxes = document.querySelectorAll(".upload-box.has-image");

    // Clear any existing image data
    formData.delete("product_images[]");

    // Add each cropped image to formData
    for (let i = 0; i < imageBoxes.length; i++) {
      const input = imageBoxes[i].querySelector("input");
      if (input.files && input.files[0]) {
        formData.append("product_images[]", input.files[0]);
      }
    }

    console.log('form data : ', formData)

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => (window.location.href = response.url))
      .catch((err) => console.log(" product add fetch error : ", err));
  });
});
