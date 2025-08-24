import { duration } from './../../node_modules/dayjs/esm/plugin/duration/index.d'
import cloudinary from '../config/cloudinary'
import { UploadApiResponse } from 'cloudinary'

interface UploadResult {
  url: string
  public_id: string
  duration?: number
}

class UploadService {
  // Upload ảnh lên Cloudinary
  async uploadImage(buffer: Buffer, folder: string = 'uploads'): Promise<UploadResult> {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'image',
              folder: folder,
              format: 'webp', // Tự động convert sang webp để tối ưu
              quality: 'auto:good'
            },
            (error, result: UploadApiResponse | undefined) => {
              if (error) {
                reject(error)
              } else if (result) {
                resolve({
                  url: result.secure_url,
                  public_id: result.public_id
                })
              } else {
                reject(new Error('Upload failed'))
              }
            }
          )
          .end(buffer)
      })
    } catch (error) {
      throw new Error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Upload video lên Cloudinary
  async uploadVideo(buffer: Buffer, folder: string = 'videos'): Promise<UploadResult> {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'video',
              folder: folder,
              quality: 'auto:good'
            },
            (error, result: UploadApiResponse | undefined) => {
              if (error) {
                reject(error)
              } else if (result) {
                resolve({
                  url: result.secure_url,
                  public_id: result.public_id,
                  duration: result.duration
                })
              } else {
                reject(new Error('Upload failed'))
              }
            }
          )
          .end(buffer)
      })
    } catch (error) {
      throw new Error(`Video upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Xóa file từ Cloudinary
  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      throw new Error(`Delete file failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Xóa video từ Cloudinary
  async deleteVideo(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'video' })
    } catch (error) {
      throw new Error(`Delete video failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export default new UploadService()
