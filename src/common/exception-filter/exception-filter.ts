import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception?.getStatus ? exception.getStatus() : 400
    let errorMessage = exception?.message
    let details = undefined

    let message = exception.details

    if (typeof exception === 'string') errorMessage = exception
    else if (exception.getResponse && typeof exception.getResponse() === 'object') {
      const exceptionResp = exception.getResponse()
      if (exceptionResp.error) errorMessage = exceptionResp.error
      if (exceptionResp.message && typeof exceptionResp.message === 'string') errorMessage = exceptionResp.message
      if (exceptionResp.message && typeof exceptionResp.message === 'object') details = exceptionResp.message
    }

    console.log(exception)

    if (typeof exception?.response?.message === 'object' && Array.isArray(exception?.response?.message)) {
      const messages = exception?.response?.message.join('.\n')
      if (messages) message = messages
    }
    if (response && response?.status && typeof response.status === 'function')
      response?.status(status)?.json({
        statusCode: status,
        details,
        message: message || errorMessage,
        timestamp: new Date().toISOString()
      })
  }
}
