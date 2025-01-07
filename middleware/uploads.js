const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');

//setting storage for file
const storage = multer.diskStorage({
    destination : async (req, file, cb)=>{
        const id = req.query.id || req.session.prodId || randomUUID();
        if(!req.query.id){
            req.session.prodId = id;
        }
        
        const dir = path.join('uploads',`product_image_${id}`);
        console.log("prod id in upload file : ",id);
        
        try{
            await fs.mkdir(dir, {recursive : true}, (er)=>{
                console.log('folder created success');
            } );
            cb(null, dir);
        }catch(err){
            console.log('folder created failed');
            cb(err,dir)
        }
        
    },
    filename : (req, file, cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

//create multer instance
const upload = multer({storage});

module.exports  = upload;