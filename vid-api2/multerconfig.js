const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const { fromIni } = require('@aws-sdk/credential-providers');

// S3 client configuration
const s3 = new S3Client({
    region: 'ap-southeast-2',
    credentials: fromIni({ profile: 'CAB432-STUDENT-901444280953' })
  });

// Set storage engine to node server local storage
const storage = multerS3({
    s3: s3,
    bucket: 'n11245409-assessment2', 
    key: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
    }
  });

// const storage = multer.diskStorage({
//     destination: './uploads/videos/',
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// Check file type
function checkFileType(file, cb) {
    const filetypes = /mp4|mkv|avi|mov|m4a|webm/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Videos Only!');
    }
}

// upload data
const upload = multer({
    storage: storage,
    limits: { fileSize: 150000000 }, // file size limit of 150MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('videoFile');

module.exports = upload;

