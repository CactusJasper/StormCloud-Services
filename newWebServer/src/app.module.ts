import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './Utilities/Logging/LoggingInterceptor';
import { ExceptionHandler } from './Utilities/Exception/ExceptionHandler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiModule } from './API/Api.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { PersistenceModule } from './Persistence/Persistence.module';
import { DomainModule } from './Domain/Domain.module';
import { DiscordModule, DiscordModuleOption } from '@discord-nestjs/core';
import { Intents, PresenceData } from 'discord.js';
import { BotModule } from './Bot/Bot.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `${process.env.NODE_ENV ?? 'development'}.env`,
        }),
        MongooseModule.forRootAsync({
            useFactory: (config: ConfigService) => {
                return <MongooseModuleOptions>{
                    uri: config.get<string>('DB_URI'),
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                };
            },
            inject: [ConfigService],
        }),
        ScheduleModule.forRoot(),
        PersistenceModule,
        ApiModule,
        DomainModule,
		BotModule
    ],
    providers: [
        {
            provide: APP_FILTER,
            useFactory: (config: ConfigService): ExceptionHandler => new ExceptionHandler(config),
            inject: [ConfigService],
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        }
    ],
})
export class AppModule {}
