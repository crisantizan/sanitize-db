import multer, { Options } from 'multer';
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

const fileFilter: Options['fileFilter'] = (req, file, cb) => {
  if (file.mimetype !== 'text/plain') {
    return cb(new Error('Only text plain files'));
  }

  cb(null, true);
};

export function uploaderMiddleware() {
  return multer({ storage, fileFilter });
}
