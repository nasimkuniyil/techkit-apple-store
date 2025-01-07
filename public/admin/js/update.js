//PRODUCTS EDIT PAGE ADMIN
const editCategory = document.querySelector("#edit-category-form");

const url = window.location;

editCategory.addEventListener("submit", async (event) => {
      event.preventDefault();
    
      const category_name = document.getElementById('category-name').value
      


  try{
    const response = await fetch(url, {
        method: "PUT",
        headers : {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify({category_name})
      });
      
      window.location.href = response.url

  }catch(err){
    console.log("edit form error", err)
  }
});
