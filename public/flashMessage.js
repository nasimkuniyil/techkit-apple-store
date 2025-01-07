function showFlashMessage({success, message}) {
  const notification = document.getElementById("notification");

  const messagePopup = document.createElement("div");

  messagePopup.id = "popup-message";
  messagePopup.className = "";
  messagePopup.classList.add(success ? 'success' : 'failed');
  messagePopup.textContent = message;
  notification.appendChild(messagePopup);
  removeElem(messagePopup);
}

function removeElem(div) {
  let timeout;
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    div.classList.add("hide");
    setTimeout(() => {
      clearTimeout(timeout);
      div.remove();
    }, 500);
  }, 2500);
}

export default showFlashMessage;