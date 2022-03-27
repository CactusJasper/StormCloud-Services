import { Injectable, Logger } from '@nestjs/common';
import { On, Once } from '@discord-nestjs/core';
import { Message } from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { ChatCommands } from './Commands/ChatCommands';

@Injectable()
export class DiscordEventHandler {
	private readonly logger = new Logger(DiscordEventHandler.name);

	constructor(private readonly configService: ConfigService,
				private readonly chatCommands: ChatCommands) {}

	@Once('ready')
	public async onReady() {
		this.logger.log('Bot was started!');
	}

	@On('messageCreate')
	public async onMessage(message: Message): Promise<void> {
		if(message.author.bot) return;
		const prefix: string = this.configService.get<string>('CHAT_COMMAND_PREFIX');
		if(!message.content.includes(prefix)) return;
		const args = message.content.substr(prefix.length, message.content.length).split(' ');
		// Handle Chat Commands
		switch(args[0].toLowerCase()) {
			case 'profile':
				await this.chatCommands.ProfileCommand(message);
				return;
			default:
				await message.reply('You provided an invalid command check sc! or the slash commands available.');
				return;
		}
	}

	@On('debug')
	public async onDebugMessage(debugMessage: Message): Promise<void> {
		this.logger.debug(debugMessage);
	}

	@On('warn')
	public async onWarnMessage(warnMessage: Message): Promise<void> {
		this.logger.warn(warnMessage);
	}
}