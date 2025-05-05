const express = require('express')
const router = express.Router()
const multer = require('multer')
//upload cover
const upload = multer({ dest: 'uploads/' })


router.post('/upload', upload.single('cover'), (req, res) => {
    console.log('File received:', req.file); // Debug log
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ message: 'File uploaded successfully', filePath: req.file.path });
}
)