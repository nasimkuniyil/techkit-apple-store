// add a section with 'pagination' class in html page


function setupPagination(totalPage, currentPage) {
    console.log('total page : ', totalPage)
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = ""; // Clear previous pagination
    
    // Create pagination items
    for (let i = 1; i <= totalPage; i++) {
      const paginationItem = document.createElement("li");
      paginationItem.classList.add("pagination-item");
      
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.classList.add("pagination-link");
      
      paginationItem.appendChild(btn);
      paginationContainer.appendChild(paginationItem);
    }
  
    // Mark the current page as active
    const paginationLinks = document.querySelectorAll(".pagination-link");
    paginationLinks.forEach((link) => {
      const pageNumber = parseInt(link.textContent);
      if (pageNumber == currentPage) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    return paginationContainer;
  }


//   funtions
function paginationFunc(event, url, cb){
  window.scrollTo({top : 0, behavior:"smooth"});
    if(event.target.className.includes('pagination-link')){
      console.log('clicked page : ', event.target.innerHTML)
      url.searchParams.set("page", event.target.innerHTML);
      cb();
    }
  }
