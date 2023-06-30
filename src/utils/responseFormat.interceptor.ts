import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const hostContext = context.switchToHttp();
    const response = hostContext.getResponse<Response>();

    return next.handle().pipe(
      map((value) => ({
        statusCode: response.statusCode,
        message: [response.statusMessage || 'Success'],
        data: value,
      })),
    );
  }
}
