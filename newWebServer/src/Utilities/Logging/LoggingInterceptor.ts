import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    /**
     * Catches all logs thrown via Logger and formats them with the method, url and date
     * @param context
     * @param next
     */
    public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = moment();
        const req = context.switchToHttp().getRequest();
        if(req)
        {
            const method = req.method;
            const url = req.url;
            return next
                .handle()
                .pipe(tap(() => Logger.log(`${method} ${url} ${moment().diff(now, 'ms')}ms`, context.getClass().name)));
        }
    }
}