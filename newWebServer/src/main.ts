import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { Logger } from '@nestjs/common';

async function bootstrap() {
	const logger = new Logger('SC Web Service');
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.enableCors(<CorsOptions> {
        credentials: true
    });

    await app.listen(8080);
	logger.log('Web Server Started on Port 8080');
}
bootstrap();
