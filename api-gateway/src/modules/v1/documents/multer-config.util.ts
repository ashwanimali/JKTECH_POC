import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
    storage: diskStorage({
        destination: './uploads/documents',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const fileExt = extname(file.originalname);
            callback(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
        },
    }),
    fileFilter: (req, file, callback) => {
        const allowedTypes = ['application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error('Invalid file type'), false);
        }
    },
};
