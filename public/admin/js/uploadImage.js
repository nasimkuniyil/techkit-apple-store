const uploadImages = async(images)=>{
    const promises = images.map(image=> uploadImage(image))
    const uploadedImages = await Promise.all(promises);

    return uploadedImages;
}

const uploadImage = async (image)=>{
    const url = 'https://api.cloudinary.com/v1_1/dnazkilh1/upload'
    options = {
        method:'POST', 
    }
    const response = await fetch(url, options);
       
}