import { Controller } from '../controller';
import { ControllerRoutes } from '@/typings/controller.type';
import { Request, Response } from 'express';
import { IndexService } from './index.service';
import { uploaderMiddleware } from '@/http/middlewares/uploader.middleware';

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
      ],
    };
  }

  /** ------------------ VIEWS ------------------ */
  private _renderIndexPage(req: Request, res: Response) {
    res.render('index');
  }

  /** ------------------ API ------------------ */
  private _uploadFile({ file }: Request, res: Response) {
    try {
      const result = this._indexService.analizeFile(file);
      this.sendResponse(result, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }
}
