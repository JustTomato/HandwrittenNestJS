import { Logger } from "./logger";
import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express'
import path from 'path'
import 'reflect-metadata'
export class NestApplication {
  private readonly app: Express = express();
  constructor(protected readonly module) {
    this.app.use(express.json()) // 用于把json格式的请求体对象放在req.body上
    this.app.use(express.urlencoded({ extended: true })) //把form表单格式的请求体对象放在req.body上
  }
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
          // 判断controller的methodName方法里有没有使用Response或者Res参数装饰器，如果使用了其中一个则不给客户端发送响应
          const responseMetadata = this.getResponseMetadata(controller, methodName);
          if (!responseMetadata || responseMetadata?.data?.passthrough) {
            // 把返回值序列化返回给客户端
            res.send(result);
          }
        })
        Logger.log(`Mapped {${routePath}, ${httpMethod}} route`, 'RoutesResolver');
      }
    }
    Logger.log(`Nest application successfully started`, 'NestApplication')
  }
  private getResponseMetadata(controller, methodName) {
    const paramsMetadata = Reflect.getMetadata('params', controller, methodName) ?? [];
    return paramsMetadata.filter(Boolean).find((param) => param.key === 'Response' || param.key === 'Res')
  }
  private resolveParams(instance: any, methodName: string, req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    const paramsMetadata = Reflect.getMetadata('params', instance, methodName) ?? [];
    // console.log('paramsMetadata', paramsMetadata)
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
          return req; //has problem 
        case 'Ip':
          return req.ip
        case 'Param':
          return data ? req.params[data] : req.params;
        case 'Body':
          return data ? req.body[data] : req.body;
        case 'Response':
        case 'Res':
          return res;
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