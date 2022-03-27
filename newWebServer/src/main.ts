import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helpers from 'handlebars-helpers';
import * as exphbs from 'express-handlebars';
import * as bodyParser from 'body-parser';
import * as Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { Logger } from '@nestjs/common';

async function bootstrap() {
	const logger = new Logger('SC Web Service');
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.enableCors(<CorsOptions> {
        credentials: true
    });

    app.engine('.hbs', exphbs({
        defaultLayout: 'main',
        extname: '.hbs',
        handlebars: allowInsecurePrototypeAccess(Handlebars),
        partialsDir: __dirname + '/views/partials/',
        helpers: helpers
    }));
    app.setViewEngine('hbs');

    await app.listen(8080);
	logger.log('Web Server Started on Port 8080');
}
bootstrap();
