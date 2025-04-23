import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '~/utils/cloudinary'

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'avatars', // Tên folder trên Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    },
})

const upload = multer({ storage })

module.exports = upload
