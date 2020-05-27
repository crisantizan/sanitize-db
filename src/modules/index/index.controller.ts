import { Controller } from '../controller';
import { ControllerRoutes } from '@/typings/controller.type';
import { Request, Response } from 'express';
import { IndexService } from './index.service';
import { uploaderMiddleware } from '@/http/middlewares/uploader.middleware';
import { validationPipe } from '@/http/pipes/validation.pipe';
import { analyzeFileSchema, sanitizeDBSchema } from '@/common/joi-schemas';

export default class IndexController extends Controller {
  public route: string = '/';

  constructor(private readonly _indexService = new IndexService()) {
    super();
    super.initRoutes(this.routes());
  }

  public async routes(): Promise<ControllerRoutes> {
    return {
      get: [
        {
          path: '',
          handler: this._renderIndexPage.bind(this),
        },
      ],
      post: [
        {
          path: '/upload-file',
          middlewares: [uploaderMiddleware().single('file')],
          handler: this._uploadFile.bind(this),
        },
        {
          path: '/analyze-file',
          middlewares: [await validationPipe(analyzeFileSchema)],
          handler: this._analyzeFileColumns.bind(this),
        },
        {
          path: '/sanitize-db',
          middlewares: [await validationPipe(sanitizeDBSchema)],
          handler: this._sanitizeDB.bind(this),
        },
      ],
    };
  }

  /** ------------------ VIEWS ------------------ */
  private _renderIndexPage(req: Request, res: Response) {
    res.render('index', { environment: 'development' });
  }

  /** ------------------ API ------------------ */

  private _uploadFile({ file }: Request, res: Response) {
    try {
      const result = this._indexService.analyzeFileContent(file);
      this.sendResponse(result, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /** analyze columns and return fields amount */
  private async _analyzeFileColumns(req: Request, res: Response) {
    try {
      console.log({ body: req.body });
      const result = await this._indexService.analyzeFileColumns(req.body);
      this.sendResponse(result, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private async _sanitizeDB(req: Request, res: Response) {
    try {
      const result = await this._indexService.sanitizeDB(req.body);
      this.sendResponse(result, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }
}
