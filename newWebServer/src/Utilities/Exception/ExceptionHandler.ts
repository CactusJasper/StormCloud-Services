import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { ConfigService } from '@nestjs/config';
import { ClassValidatorException } from './ClassValidatorException';
import { Exception } from './Exception';
import { DiscordCommandException } from '../DiscordHelpers/DiscordCommandException';

@Catch()
export class ExceptionHandler implements ExceptionFilter {
    constructor(private readonly configService: ConfigService) {}

    public async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
        const ctx: HttpArgumentsHost = host.switchToHttp();
        const response: any = ctx.getResponse();
        const request: any = ctx.getRequest();

        let formattedException: Exception;
        if(exception instanceof ClassValidatorException) formattedException = this.HandleClassValidatorException(exception);
        else if(exception instanceof HttpException) formattedException = this.HandleHttpException(exception);
        else formattedException = this.HandleOtherException(exception);
        const errorLog = `${request.method} ${request.url} ${(<Error>exception).message || formattedException.message}`;

		if(exception instanceof DiscordCommandException) {
			Logger.error(`[Command Error][${exception.commandName}] ${exception.message}`);
			await exception.channel.send(`[Command Error][${exception.commandName}] ${exception.message}`);
		} else if(formattedException.code === HttpStatus.NOT_FOUND) {
            response.render(
                'errors/404',
                { layout: 'layouts/main' }
            );
        } else {
            Logger.error(errorLog);
            response.status(formattedException.code).json(formattedException);
        }
    }

    /**
     * Allows errors to be logged in Exception Handler format from anywhere (including Promise Catches)
     * @param exception
     * @param method
     * @param url
     * @constructor
     */
    public static ManuallyThrowException(exception: Error, method: string, url: string): void {
        Logger.error(`${method} ${url} ${exception.message}`);
    }

    /**
     * Handles all HTTP errors
     * @param exception
     * @constructor
     */
    public HandleHttpException(exception: HttpException): Exception {
        const statusCode: number = exception.getStatus();
        return new Exception(statusCode, exception.message);
    }

    /**
     * Handles all class-validator errors
     * @param exception
     * @constructor
     */
    public HandleClassValidatorException(exception: ClassValidatorException): Exception {
        const statusCode: HttpStatus = HttpStatus.BAD_REQUEST;
        return new Exception(
            statusCode,
            `\n${exception.formattedValidationErrors.join(', \n')}`,
        );
    }

    /**
     * Handles all other unknown errors
     * @constructor
     */
    public HandleOtherException(exception: any): Exception {
        if (exception.name?.includes('UserExistsError')) return new Exception(HttpStatus.CONFLICT, exception.message);
        return this.configService.get<string>('NODE_ENV') === 'development'
            ? new Exception(HttpStatus.INTERNAL_SERVER_ERROR, exception.message ?? null)
            : new Exception(HttpStatus.INTERNAL_SERVER_ERROR, null);
    }
}
