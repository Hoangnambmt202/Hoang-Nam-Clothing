import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(fileBase64: string): Promise<UploadApiResponse> {
    return cloudinary.uploader.upload(fileBase64, {
      folder: 'hoangnam-clothing/products',
    });
  }

  async uploadBuffer(buffer: Buffer, originalName: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'hoangnam-clothing/products',
          public_id: originalName.replace(/\.[^/.]+$/, ''),
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        },
      );
      stream.end(buffer);
    });
  }

  async deleteImageByUrl(url: string): Promise<any> {
    try {
      if (!url.includes('cloudinary.com')) return null;
      
      const parts = url.split('/');
      const uploadIndex = parts.findIndex(p => p === 'upload');
      
      if (uploadIndex !== -1 && parts.length > uploadIndex + 2) {
        const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/');
        const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '');
        return await cloudinary.uploader.destroy(publicId);
      }
      return null;
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error);
      return null;
    }
  }
}
