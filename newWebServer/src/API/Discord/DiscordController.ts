import { Controller, Get, Inject } from '@nestjs/common';
import { DiscordClientService } from '@discord-nestjs/core/dist/services/discord-client.service';

@Controller('discord')
export class DiscordController {
	constructor(@Inject('CustomDiscordService') public readonly discordService: DiscordClientService) {
	}

	@Get()
	public async getGuildChannels() {
		return this.discordService.getClient().channels.cache.toJSON();
	}
}