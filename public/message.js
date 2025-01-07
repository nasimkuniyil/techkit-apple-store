const flash_items = document.querySelectorAll(".flash");

flash_items.forEach((flash) => {
  if(flash.innerHTML != ""){
    flash.classList.add("show")
  }
  // Set a timeout to hide the alert after 5 seconds
  setTimeout(() => {
    flash.classList.remove("show");
  }, 3000); // 5000 milliseconds = 5 seconds
});
