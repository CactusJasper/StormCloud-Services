import { Inject, Injectable } from '@nestjs/common';
import { DiscordClientService } from '@discord-nestjs/core/dist/services/discord-client.service';
import { Client, DMChannel, Guild, GuildMember, MessagePayload } from 'discord.js';

@Injectable()
export class MessageUtilities {
	constructor(@Inject('CustomDiscordService') private readonly discordService: DiscordClientService) {}

	public async sendDmMessage(message: MessagePayload, userId: string, guildId: string): Promise<void> {
		const client: Client = this.discordService.getClient();
		const guild: Guild = client.guilds.cache.find((guild: Guild) => guild.id === guildId);
		const member: GuildMember = guild.members.cache.find((member) => member.id === userId);
		const channel: DMChannel = await member.createDM(true);
		await channel.send(message);
	}
}