import express from 'express';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { fileData, folder = 'skill-swap' } = req.body;
    if (!fileData) {
      return res.status(400).json({ message: 'No file data provided' });
    }

    const uploadResult = await uploadToCloudinary(fileData, folder);
    return res.json({
      message: 'File uploaded to Cloudinary successfully',
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
    });
  } catch (err) {
    console.error('Upload route error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;
