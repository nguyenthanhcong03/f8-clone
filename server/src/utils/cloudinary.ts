import cloudinary from '@/config/cloudinary'

export const uploadImage = (buffer: Buffer, folder: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) return reject(error)
          return resolve(result)
        }
      )
      .end(buffer)
  })
}
export const uploadMultiple = async (files: Express.Multer.File[], folder: string) => {
  const uploads = files.map((file) => uploadImage(file.buffer, folder))
  return Promise.all(uploads)
}

export const uploadVideo = (buffer: Buffer, folder: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'video'
        },
        (error, result) => {
          if (error) return reject(error)
          return resolve(result)
        }
      )
      .end(buffer)
  })
}

export const deleteVideo = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId, { resource_type: 'video' })
}

export const deleteImage = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
}

export const deleteMultiple = async (publicIds: string[]) => {
  const deletions = publicIds.map((publicId) => deleteImage(publicId))
  return Promise.all(deletions)
}

// Helper
// Extract Cloudinary URLs từ HTML content
export const extractCloudinaryUrls = (content: string): string[] => {
  if (!content) return []

  // Regex để tìm tất cả URL Cloudinary trong content
  const cloudinaryRegex = /https?:\/\/res\.cloudinary\.com\/[^\s"'<>]+/g
  const matches = content.match(cloudinaryRegex)
  return matches || []
}

// Extract public IDs từ Cloudinary URLs
export const extractPublicIds = (urls: string[]): string[] => {
  return urls
    .map((url) => {
      try {
        // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{version}/{public_id}.{format}
        const parts = url.split('/upload/')
        if (parts.length < 2) return null

        const pathParts = parts[1].split('/')
        // Bỏ version number nếu có (vXXXXXXXXXX)
        const relevantParts = pathParts.filter((part) => !part.match(/^v\d+$/))

        // Lấy public_id (có thể có folder) và bỏ extension
        const publicIdWithExt = relevantParts.join('/')
        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '') // Bỏ extension

        return publicId
      } catch (error) {
        return null
      }
    })
    .filter((id): id is string => id !== null)
}

// Tìm và xóa các ảnh không còn được sử dụng
export const cleanupUnusedImages = async (oldContent: string, newContent: string): Promise<void> => {
  try {
    const oldUrls = extractCloudinaryUrls(oldContent)
    const newUrls = extractCloudinaryUrls(newContent)

    // Tìm các URL có trong content cũ nhưng không có trong content mới
    const unusedUrls = oldUrls.filter((url) => !newUrls.includes(url))

    if (unusedUrls.length > 0) {
      const unusedPublicIds = extractPublicIds(unusedUrls)
      console.log('unusedPublicIds :>> ', unusedPublicIds)
      // await deleteMultiple(unusedPublicIds)
    }
  } catch (error) {
    // Log error nhưng không throw để không block update
    console.error('Failed to cleanup unused images:', error)
  }
}
