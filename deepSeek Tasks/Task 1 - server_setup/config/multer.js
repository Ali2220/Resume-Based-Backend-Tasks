const multer = require("multer");
const path = require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  },
});

function fileFilter(req, file, cb){
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = allowedTypes.test(file.mimetype)

    if(extname && mimeType){
        return cb(null, true)
    }else{
        cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed', false))
    }

}

const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: fileFilter
})

module.exports = upload