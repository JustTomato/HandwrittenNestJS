import 'reflect-metadata'
export function Get(path: string = ''): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('path', path, descriptor.value)
    Reflect.defineMetadata('method', 'GET', descriptor.value)
  }
}
