const delete_buttons = document.querySelectorAll(".delete-item-button");
const delete_permenent_btn = document.querySelector("#permenent-delete-items");


//SOFT DELETE
delete_buttons.forEach((btn) => {
  
  btn.addEventListener("click", (event) => {

    event.preventDefault();
    const url = btn.getAttribute("href");

    fetch(url, {
      method: "DELETE",
    })
      .then((data) => {
        window.location.href = data.url;
      })
      .catch((er) => console.log("fetch delete error", er));
  });
});


// PERMENENT DELETE ITEMS
if(delete_permenent_btn){
    delete_permenent_btn.addEventListener("click", (event) => {
        event.preventDefault();
        const url = window.location.pathname+"/delete-permenent";
    
        fetch(url, {
          method: "DELETE",
        })
          .then((data) => {
            window.location.href = data.url;
          })
          .catch((er) => console.log("fetch delete error", er));
      });
    
}