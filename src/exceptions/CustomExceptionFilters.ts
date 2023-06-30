import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    const errorObj =
      typeof message === 'string'
        ? { statusCode: status, message: [message], error: message }
        : { ...message };

    response.status(status).json({ ...errorObj });
  }
}
