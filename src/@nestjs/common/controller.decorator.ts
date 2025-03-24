import 'reflect-metadata'
interface ControllerOptions {
  prefix?: string
}
// 函数重载
export function Controller(): ClassDecorator
export function Controller(prefix: string): ClassDecorator
export function Controller(options: ControllerOptions): ClassDecorator
export function Controller(prefixOptions?: string | ControllerOptions): ClassDecorator {
  let options: ControllerOptions = {};
  if (typeof prefixOptions === 'string') {
    options.prefix = prefixOptions
  } else if (typeof prefixOptions === 'object') {
    options = prefixOptions
  }
  // 这是一个类装饰器，装饰控制器这个类
  return (target: Function) => {
    Reflect.defineMetadata('prefix', options.prefix || '', target)
  }
}