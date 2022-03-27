import {
	BaseGuildTextChannel,
} from 'discord.js';

export class DiscordCommandException extends Error {
	public commandName: string;
	public message: string;
	public channel: BaseGuildTextChannel | null;

	constructor(commandName: string, message: string, channel: BaseGuildTextChannel | null) {
		super();
		this.commandName = commandName;
		this.message = message;
		this.channel = channel;
	}
}