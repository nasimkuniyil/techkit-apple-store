function editCategory(event){
  const url = event.target.action;

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