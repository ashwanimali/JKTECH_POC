import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggerService } from '../utils/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerService) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        const method = request.method;
        const url = request.originalUrl || request.url;
        const body = request.body;
        const user = request.user || {};
        const userId = user.userId || 'anonymous';

        const logHeader = `[${method}] ${url} | User: ${userId}`;
        const startTime = Date.now();
        request['startTime'] = startTime
        this.logger.log(logHeader, body, {});

        return next.handle().pipe(
            map((response) => {
                const duration = Date.now() - startTime;
                this.logger.log(logHeader, {}, response, duration);
                return response;
            }),
        );
    }
}
