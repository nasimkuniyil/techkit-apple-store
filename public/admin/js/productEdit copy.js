document.addEventListener("DOMContentLoaded", () => {
  const uploadSection = document.querySelector(".upload-section");
  const addMore = document.querySelector(".add-more");
  const cropModal = new bootstrap.Modal(document.getElementById("cropModal"));
  const cropImage = document.getElementById("image");
  const cropBtn = document.getElementById("cropBtn");
  const form = document.getElementById("prod-form");

  let uploadCount = document.querySelectorAll(".existing-image-box").length;
  let currentUploadBox = null;
  let cropper = null;

  let deletedImages = [];

  // Reuse your existing , showCropModal, and other utility functions
  // from your add page...

  //handleUpload
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

  //   show crop modal
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

  // New function to handle existing image removal
  window.removeExistingImage = function (button) {
    const imageBox = button.closest(".existing-image-box");
    const imageId = imageBox.dataset.imageId;

    deletedImages.push(imageId);

    // Add hidden input to track removed images
    const removedInput = document.createElement("input");
    removedInput.type = "hidden";
    removedInput.name = "removed_images[]";
    removedInput.value = imageId;
    form.appendChild(removedInput);

    imageBox.remove();
    uploadCount--;

    // Show new image upload boxes if needed
    updateUploadBoxes();
  };

  function updateUploadBoxes() {
    const totalSlots = 4;
    const currentUploadBoxes = document.querySelectorAll(".upload-box").length;
    const existingImages = document.querySelectorAll(
      ".existing-image-box"
    ).length;
    const neededBoxes = totalSlots - existingImages - currentUploadBoxes;

    if (neededBoxes > 0) {
      for (let i = 0; i < neededBoxes; i++) {
        const newBox = document.createElement("div");
        newBox.className = "upload-box";
        newBox.innerHTML = `
            <input type="file" accept="image/*" name="new_images[]">
            <div class="plus-icon"></div>
            <button type="button" class="remove-btn">×</button>
          `;
        uploadSection.appendChild(newBox);
        handleUpload(newBox);
      }
    }

    // Update add-more button visibility
    const totalImages = existingImages + currentUploadBoxes;
    addMore.style.display = totalImages >= 4 ? "none" : "flex";
  }

  // Modified form submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const existingImages = document.querySelectorAll(
      ".existing-image-box"
    ).length;
    const newImages = document.querySelectorAll(".upload-box.has-image").length;
    const totalImages = existingImages + newImages;

    if (totalImages < 1) {
      alert("At least one image is required");
      return false;
    }

    const url = form.action;
    const formData = new FormData(form);

    // Add existing images
    document.querySelectorAll(".existing-image-box").forEach((box) => {
      const imageId = box.dataset.imageId;
      formData.append("existing_images[]", imageId);
    });

    // Add new images
    document
      .querySelectorAll(".upload-box.has-image input")
      .forEach((input) => {
        if (input.files && input.files[0]) {
          formData.append("new_images[]", input.files[0]);
        }
      });

    try {
      fetch(url, {
        method: "PUT",
        body: formData,
      })
        .then((response) => window.location.href = response.url)
        .catch((err) => console.log(" product add fetch error : ", err));
    } catch (err) {
      console.error("Product update error:", err);
      alert("Failed to update product. Please try again.");
    }
  });

  // Initialize upload handlers
  document.querySelectorAll(".upload-box").forEach(handleUpload);
});
