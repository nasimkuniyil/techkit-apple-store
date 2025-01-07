const color_parent = document.querySelector('#model-colors-wrapper');

color_parent.addEventListener('click', (event)=>{
    console.log(event.target.getAttribute('name'))
})