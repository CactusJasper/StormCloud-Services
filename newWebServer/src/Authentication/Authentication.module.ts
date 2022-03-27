import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserSchema } from '../Persistence/User/User.entity';
import { DiscordStrategy } from './Strategies/Discord/Discord.strategy';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'local-mongoose', session: true }),
		MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
	],
	providers: [DiscordStrategy],
	exports: [DiscordStrategy],
})
export class AuthenticationModule {}
