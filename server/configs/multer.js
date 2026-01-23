import multer from "multer";

const storage = multer.diskStorage({
    // 1. Configure filename so files keep their extensions (e.g., .png, .jpg)
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// 2. Export 'upload' as a named export to match your router's { upload } import
export const upload = multer({ storage });