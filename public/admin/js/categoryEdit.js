// function fetchCategoryData(){
//   const url = '/category/data'+window.location.search
//   axios.get(url)
//   .then(response=>{
//     document.getElementById('categoryEditForm').action = "/admin/api/category/edit"+window.location.search;
//     document.getElementById('category-name').value = response.data.category_name
//     document.getElementById('description').value = response.data.description;
//   })
//   .catch(err=>{
//     console.log('get data for edit page error.')
//   })
// }

function editCategory(event){
  const url = event.target.action;
  console.log('url : ', url);

  const data = {
    category_name : document.getElementById('category-name').value,
    description : document.getElementById('description').value
  }
  axios.get(url, data)
  .then(response=>{
    console.log('res : ', response)
  })
  .catch(err=>{
    console.log('get data for edit page error.', err)
  })
}