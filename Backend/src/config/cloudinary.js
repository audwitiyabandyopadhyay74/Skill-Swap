import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'skill-swap-demo',
  api_key: process.env.CLOUDINARY_API_KEY || '1234567890',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'secret',
});

export const uploadToCloudinary = async (fileDataUri, folder = 'skill-swap') => {
  if (!fileDataUri) return null;

  const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!isCloudinaryConfigured) {
    console.log('[Cloudinary Notice] Cloudinary environment variables not set. Using local file URL.');
    return {
      secure_url: typeof fileDataUri === 'string' ? fileDataUri : fileDataUri.fileUrl,
      public_id: `local-${Date.now()}`,
    };
  }

  try {
    const uploadStr = typeof fileDataUri === 'string' ? fileDataUri : fileDataUri.fileUrl;
    const result = await cloudinary.uploader.upload(uploadStr, {
      folder,
      resource_type: 'auto',
    });
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('[Cloudinary Upload Error]:', error.message);
    const fallbackUrl = typeof fileDataUri === 'string' ? fileDataUri : fileDataUri.fileUrl;
    return {
      secure_url: fallbackUrl,
      public_id: `fallback-${Date.now()}`,
    };
  }
};

export default cloudinary;
