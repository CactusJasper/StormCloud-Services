import { Module } from '@nestjs/common';
import { ApiController } from './ApiController';
import { AuthController } from './Auth/AuthController';
import { DiscordController } from './Discord/DiscordController';
import { DomainModule } from '../Domain/Domain.module';
import { BotModule } from '../Bot/Bot.module';
import { AuthenticationModule } from '../Authentication/Authentication.module';

@Module({
    controllers: [ApiController, AuthController, DiscordController],
    imports: [DomainModule, BotModule, AuthenticationModule],
	providers: [],
    exports: [],
})
export class ApiModule {}