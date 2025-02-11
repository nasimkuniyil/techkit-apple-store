const addForm = document.querySelector("#categoryAddForm");
const editForm = document.querySelector("#categoryEditForm");
const catName = document.querySelector("#category-name");
const catDescription = document.querySelector("#description");
const categoryDelBtn = document.querySelector("#category-del-btn");

// add category form
if (addForm) {
  addForm.addEventListener("submit", onSubmitAdd);
}

// edit category form
if (editForm) {
  editForm.addEventListener("submit", onSubmitEdit);
}

// Functions
function blockCategory(event,id) {
  if (confirm("Are you sure you want to cancel? All changes will be lost.")) {
    const url = `/admin/api/category/block?id=${id}`;
    const options = {
      method: "PUT",};
    fetch(url, options)
      .then((response) => (window.location.href = "/admin/category"))
      .catch((err) => console.log("something happend in add category"));
  }
}
function unblockCategory(event,id) {
  if (confirm("Are you sure you want to cancel? All changes will be lost.")) {
    const url = `/admin/api/category/unblock?id=${id}`;
    const options = {
      method: "PUT",};
    fetch(url, options)
      .then((response) => (window.location.href = "/admin/category"))
      .catch((err) => console.log("something happend in add category"));
  }
}

function onSubmitAdd(event) {
  event.preventDefault();

  if (!catName.value) {
    showErrorMessage(catName, "text");
    return;
  }
  if (catDescription.textLength == 0) {
    showErrorMessage(catDescription, "text");
    return;
  }

  const formData = {
    category_name: catName.value,
    description: catDescription.value,
  };

  const url = addForm.action;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  };
  fetch(url, options)
    .then((response) => (window.location.href = '/admin/category'))
    .catch((err) => console.log("something happend in add category"));
}

function onSubmitEdit(event) {
  event.preventDefault();

  if (!catName.value) {
    showErrorMessage(catName, "text");
    return;
  }
  if (catDescription.textLength == 0) {
    showErrorMessage(catDescription, "text");
    return;
  }

  const url = editForm.action;
  console.log('url : ', url);

  const data = {
    category_name : document.getElementById('category-name').value,
    description : document.getElementById('description').value
  }
  axios.put(url, data)
  .then(response=>{
    window.location.href = '/admin/category'

  })
  .catch(err=>{
    console.log('get data for edit page error.', err)
  })
}

// Create Form Data
function createFormData(form) {
  const formData = new FormData(form);

  let obj = {};

  formData.forEach((value, key) => {
    obj[key] = value;
  });

  return obj;
}

// Form validation function
function showErrorMessage(elem, type) {
  const text = type == "file" ? "Add" : type == "dropdown" ? "Select" : "Enter";

  const errText = document.createElement("p");
  errText.textContent = `${text} ${elem.name}`;
  errText.classList.add("err-text");
  elem.parentNode.classList.add("err-text-parent");
  elem.parentNode.appendChild(errText);
}
