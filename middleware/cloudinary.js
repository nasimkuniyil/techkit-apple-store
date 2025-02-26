const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY, 
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
});

const image  = './uploads/product_image.jpg'

const dir_name = path.join(__dirname,'../','uploads');

const images = fs.readdirSync(dir_name);





async function run (){
    for (const image of images){
        const result = await cloudinary.uploader.upload(image);
    }
}

module.exports = cloudinary;
