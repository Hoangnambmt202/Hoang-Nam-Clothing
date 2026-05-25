import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return cloudinary.config({
      cloud_name: configService.get<string>('Cloudinary_Cloud_Name'),
      api_key: configService.get<string>('Cloudinary_Key'),
      api_secret: configService.get<string>('Cloudinary_Secret'),
    });
  },
};
