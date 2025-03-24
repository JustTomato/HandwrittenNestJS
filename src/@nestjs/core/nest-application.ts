import { Logger } from "./logger";
import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express'
import path from 'path'
import 'reflect-metadata'
export class NestApplication {
  private readonly app: Express = express();
  constructor(protected readonly module) { }
  use(middleware) {
    this.app.use(middleware);
  }
  async init() {
    const controllers = Reflect.getMetadata('controllers', this.module) || [];
    // console.log('controllers', controllers)
    Logger.log(`AppModule dependencies initialized`, 'InstanceLoader')
    for (const Controller of controllers) {
      const controller = new Controller();
      const prefix = Reflect.getMetadata('prefix', Controller) || '/';
      Logger.log(`${Controller.name} {${prefix}}`, 'RouterResolver');
      const controllerPrototype = Controller.prototype;
      for (const methodName of Object.getOwnPropertyNames(controllerPrototype)) {
        const method = controllerPrototype[methodName];
        const httpMethod = Reflect.getMetadata('method', method);
        const pathMetadata = Reflect.getMetadata('path', method);
        if (!httpMethod) continue;
        const routePath = path.posix.join('/', prefix, pathMetadata)
        this.app[httpMethod.toLowerCase()](routePath, (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
          const args = this.resolveParams(controller, methodName, req, res, next)
          const result = method.call(controllers, ...args);
          res.send(result);
        })
        Logger.log(`Mapped {${routePath}, ${httpMethod}} route`, 'RoutesResolver');
      }
    }
    Logger.log(`Nest application successfully started`, 'NestApplication')
  }
  private resolveParams(instance: any, methodName: string, req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    const paramsMetadata = Reflect.getMetadata('params', instance, methodName);
    console.log('paramsMetadata', paramsMetadata)
    return paramsMetadata.map(paramMetadata => {
      const { key, data } = paramMetadata;
      switch (key) {
        case 'Request':
        case 'Req':
          return req;
        case 'Query':
          return data ? req.query[data] : req.query
        case 'Headers':
          return data ? req.headers[data] : req.headers
        case 'Session':
          return data ? req.session[data] : req.session
        default:
          return null
      }
    })
  }
  async listen(port) {
    await this.init();
    this.app.listen(port, () => {
      Logger.log(`Application is running on http://localhost:${port}`, 'NestApplication')
    })
  }
}