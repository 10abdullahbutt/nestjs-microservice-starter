import { GrpcMethod } from '@nestjs/microservices'

export const ExtendGrpcDecorator = (name: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    //eslint-disable-next-line
    return GrpcMethod(name, propertyKey)(target, propertyKey, descriptor)
  }
}

export const GrpcController =
  (name?: string): ClassDecorator =>
  (target: any) => {
    //eslint-disable-next-line
    let currentTarget = target
    //eslint-disable-next-line
    const methodNames = Object.getOwnPropertyNames(currentTarget.prototype).filter((item) => typeof currentTarget.prototype[item] === 'function')

    methodNames
      //eslint-disable-next-line
      .filter((methodName) => methodName !== 'constructor')
      .forEach((methodName) => {
        //eslint-disable-next-line
        ExtendGrpcDecorator(name)(currentTarget.prototype, methodName, Object.getOwnPropertyDescriptor(currentTarget.prototype, methodName))
      })

    currentTarget = Object.getPrototypeOf(currentTarget)
  }
