import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now(); // Record the start time

    const { method, url, body, query, params } = request; // Destructure request properties

    console.log(`Request ${method} ${url}`);
    console.log('Request Body:', body);
    console.log('Query Parameters:', query);
    console.log('Route Parameters:', params);

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const endTime = Date.now(); // Record the end time
        const executionTime = endTime - startTime;

        console.log(
          `Response ${method} ${url} - Status: ${response.statusCode} - Execution Time: ${executionTime}ms`,
        );
      }),
    );
  }
}
