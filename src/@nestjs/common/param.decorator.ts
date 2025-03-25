import 'reflect-metadata'
export const createParamDecorator = (key: string) => {
  return (data?:any) => (target: any, propertyKey: string, parameterIndex: number) => {
    // console.log(target, propertyKey, parameterIndex)
    const existingParameters = Reflect.getMetadata('params', target, propertyKey) ?? [];
    existingParameters[parameterIndex] = { parameterIndex, key ,data};
    console.log('existingParameters', existingParameters)
    Reflect.defineMetadata('params', existingParameters, target, propertyKey)
  }
}

export const Request = createParamDecorator('Request');
export const Req = createParamDecorator('Req');
export const Query = createParamDecorator('Query');
export const Headers = createParamDecorator('Headers');
export const Session = createParamDecorator('Session');
export const Ip = createParamDecorator('Ip');
export const Param = createParamDecorator('Param');