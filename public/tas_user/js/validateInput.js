//Error message
function validateInput(elem, type) {
    const text = type == "file" ? "Add" : type == "dropdown" ? "Select" : "Enter";
  
    const errText = document.createElement("p");
    errText.textContent = `${text} ${elem.name}`;
    errText.classList.add("err-text");
    elem.parentNode.classList.add("err-text-parent");
    elem.parentNode.appendChild(errText);
  }