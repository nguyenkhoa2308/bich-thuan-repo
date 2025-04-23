import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: 'dbjtf1pxl',
    api_key: '784123435728639',
    api_secret: 'q7MZEK_ZdCYzVRxQIt_Tq-dSxuQ',
})

// // Hàm xóa avatar cũ khỏi Cloudinary
// const deleteOldAvatar = async (avatarUrl) => {
//     const publicId = avatarUrl.split('/').pop().split('.')[0] // Lấy publicId từ URL ảnh
//     try {
//         await cloudinary.uploader.destroy(publicId) // Xóa ảnh trên Cloudinary
//         console.log(`Successfully deleted avatar: ${publicId}`)
//     } catch (error) {
//         console.error('Error deleting old avatar:', error)
//     }
// }

module.exports = cloudinary
