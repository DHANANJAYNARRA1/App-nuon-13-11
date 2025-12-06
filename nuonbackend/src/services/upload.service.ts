import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
    private uploadDir = path.join(process.cwd(), 'uploads');

    constructor() {
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }

        // Configure Cloudinary (optional for development)
        if (process.env.CLOUDINARY_CLOUD_NAME) {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            });
        }
    }

    async uploadFile(file: any): Promise<any> {
        try {
            // For development, use local storage
            const fileName = `${Date.now()}-${file.originalname}`;
            const filePath = path.join(this.uploadDir, fileName);

            // Move file to uploads directory
            fs.renameSync(file.path, filePath);

            const url = `http://localhost:5000/uploads/${fileName}`;

            return {
                success: true,
                url: url,
                publicId: fileName,
                message: 'File uploaded successfully'
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async uploadImage(file: any): Promise<any> {
        try {
            // For development, use local storage
            const fileName = `${Date.now()}-${file.originalname}`;
            const filePath = path.join(this.uploadDir, fileName);

            // Move file to uploads directory
            fs.renameSync(file.path, filePath);

            const url = `http://localhost:5000/uploads/${fileName}`;

            return {
                success: true,
                url: url,
                publicId: fileName,
                message: 'Image uploaded successfully'
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async uploadVideo(file: any): Promise<any> {
        try {
            // For development, use local storage
            const fileName = `${Date.now()}-${file.originalname}`;
            const filePath = path.join(this.uploadDir, fileName);

            // Move file to uploads directory
            fs.renameSync(file.path, filePath);

            const url = `http://localhost:5000/uploads/${fileName}`;

            return {
                success: true,
                url: url,
                publicId: fileName,
                message: 'Video uploaded successfully'
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async uploadMultipleFiles(files: any[]): Promise<any> {
        try {
            const uploadedFiles = await Promise.all(
                files.map(async (file) => {
                    const result = await cloudinary.uploader.upload(file.path, {
                        resource_type: 'auto',
                        folder: 'files'
                    });

                    // Remove file from local storage
                    fs.unlinkSync(file.path);

                    return {
                        originalName: file.originalname,
                        filename: file.filename,
                        size: file.size,
                        mimetype: file.mimetype,
                        url: result.secure_url,
                        publicId: result.public_id
                    };
                })
            );

            return {
                success: true,
                message: `${files.length} files uploaded successfully`,
                files: uploadedFiles
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async deleteFile(filename: string): Promise<any> {
        try {
            // For Cloudinary, we need the public_id to delete
            // This is a simplified version - in real implementation,
            // you'd need to store the public_id when uploading
            return {
                success: true,
                message: 'File deletion not implemented for Cloudinary'
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}