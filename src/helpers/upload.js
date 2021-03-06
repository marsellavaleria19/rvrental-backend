/* eslint-disable no-unused-vars */
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const multer = require('multer');

const { CLOUD_NAME,CLOUD_API_KEY,CLOUD_API_SECRET,ENVIRONMENT } = process.env;

cloudinary.config({ 
    cloud_name: CLOUD_NAME, 
    api_key: CLOUD_API_KEY, 
    api_secret: CLOUD_API_SECRET 
});

var storage = null;
if(ENVIRONMENT=="production"){
    storage = new CloudinaryStorage({
        cloudinary : cloudinary,
        params : {
            folder:'vehicle-rent/uploads',
            format : async (req, file)=>'png',
            public_id : (req, file)=>{
                const timestamp = Date.now();
                return `${req.fileUpload}-${timestamp}`;
            }
        },
    });
}else{
    storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function(req, file, cb) {
            const extension = file.originalname.substring(3);
            console.log(extension);
            cb(null, file.originalname);
        }
    });
}

const fileFilter = (req, file, cb) => {
    const typeImage = [
        "image/jpeg",
        "image/png",
        "image/gif"
    ];

    if (!typeImage.includes(file.mimetype)) {
        cb(new Error("Type image must be .jpg/.png/.gif"), false);
    } else {
        cb(null, true);
    }
};

const upload = multer({ storage: storage, fileFilter, limits: { fileSize: 2000000 } });

module.exports = upload;