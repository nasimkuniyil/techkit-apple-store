// Add this seciont in html page
// 
const notification = document.createElement("section");
notification.id = 'notification'
document.querySelector('body').appendChild(notification);
function showFlashMessage({success, message}) {

  notification.innerHTML=""

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