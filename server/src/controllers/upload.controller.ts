import asyncHandler from '@/utils/asyncHandler'
import ApiError from '@/utils/ApiError'
import { responseHandler } from '@/utils/responseHandler'
import { Request, Response } from 'express'
import { deleteImage, uploadImage } from '@/utils/cloudinary'

// Upload single image
const uploadImageController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'Vui lòng chọn file để upload')
  }

  // Kiểm tra loại file
  if (!req.file.mimetype.startsWith('image/')) {
    throw new ApiError(400, 'Chỉ chấp nhận file ảnh')
  }

  const folder = (req.body.folder as string) || 'uploads'
  const uploadResult = await uploadImage(req.file.buffer, folder)

  responseHandler(res, 200, 'Upload ảnh thành công', {
    url: uploadResult.url,
    publicId: uploadResult.publicId
  })
})

// Upload multiple images
const uploadMultipleImages = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[]

  if (!files || files.length === 0) {
    throw new ApiError(400, 'Vui lòng chọn ít nhất một file để upload')
  }

  // Kiểm tra tất cả files đều là ảnh
  const invalidFiles = files.filter((file) => !file.mimetype.startsWith('image/'))
  if (invalidFiles.length > 0) {
    throw new ApiError(400, 'Chỉ chấp nhận file ảnh')
  }

  const folder = (req.body.folder as string) || 'uploads'

  // Upload tất cả ảnh song song
  const uploadPromises = files.map((file) => uploadImage(file.buffer, folder))
  const uploadResults = await Promise.all(uploadPromises)

  const results = uploadResults.map((result) => ({
    url: result.url,
    publicId: result.publicId
  }))

  responseHandler(res, 200, `Upload ${results.length} ảnh thành công`, results)
})

// Delete image
const deleteImageController = asyncHandler(async (req: Request, res: Response) => {
  const { publicId } = req.body

  if (!publicId) {
    throw new ApiError(400, 'Vui lòng cung cấp publicId')
  }

  await deleteImage(publicId)
  responseHandler(res, 200, 'Xóa ảnh thành công', null)
})

export default {
  uploadImageController,
  uploadMultipleImages,
  deleteImageController
}
