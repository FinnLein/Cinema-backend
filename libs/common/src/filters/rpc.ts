// apps/gateway/src/common/filters/rpc-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Response } from 'express'

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const error = exception.getError();
    
    
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    
    if (typeof error === 'object' && error !== null) {
      statusCode = error['statusCode'] || HttpStatus.INTERNAL_SERVER_ERROR;
      message = error['message'] || 'Internal server error';
    } else if (typeof error === 'string') {
      message = error;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}