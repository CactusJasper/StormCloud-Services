import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { stringify } from 'querystring';
import axios, { AxiosResponse } from 'axios';
import { DiscordUser } from './DiscordUser.type';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
	private logger: Logger = new Logger('Passport Discord');

	constructor(private readonly configService: ConfigService) {
		super({
			authorizationURL: `https://discordapp.com/api/oauth2/authorize?${stringify({
				response_type: 'code',
			})}`,
			tokenURL: 'https://discordapp.com/api/oauth2/token',
			clientID: configService.get<string>('DISCORD_CLIENT_ID'),
			clientSecret: configService.get<string>('DISCORD_CLIENT_SECRET'),
			callbackURL: configService.get<string>('DISCORD_CALLBACK_URI'),
			scope: ['identify', 'guilds']
		});
	}

	public async validate(accessToken: string): Promise<any> {
		const res: AxiosResponse = await axios.get('https://discordapp.com/api/users/@me', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		if(res.status !== HttpStatus.OK) throw new HttpException('Something Unexpected Happend', HttpStatus.INTERNAL_SERVER_ERROR);
		const discordUser: DiscordUser = res.data;
		this.logger.log(discordUser);
		return discordUser;
	}
}