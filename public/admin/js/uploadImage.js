const uploadImages = async(images)=>{
    const promises = images.map(image=> uploadImage(image))
    const uploadedImages = await Promise.all(promises);

    return uploadedImages;
}

const uploadImage = async (image)=>{
    console.log('image uploading...');
    const url = 'https://api.cloudinary.com/v1_1/dnazkilh1/upload'
    options = {
        method:'POST', 
    }
    const response = await fetch(url, options);
       
}


// we can continue after complete weekly task.