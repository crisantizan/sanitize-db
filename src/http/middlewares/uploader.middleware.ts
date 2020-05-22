import multer from 'multer';
import { extname } from 'path';
import { generatePath } from '@/helpers/generate-path.helper';

const storage = multer.diskStorage({
  destination: generatePath('uploads'),
  filename(req, file, cb) {
    const extension = extname(file.originalname);
    const name = Date.now();

    cb(null, `${name}${extension}`);
  },
});

export function uploaderMiddleware() {
  return multer({ storage });
}
