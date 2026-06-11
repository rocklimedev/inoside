import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class MetricsInterceptor implements NestInterceptor {
    static requests: number;
    static totalResponseTime: number;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
