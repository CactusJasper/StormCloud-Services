import { Module } from '@nestjs/common';
import { DiscordEventHandler } from './DiscordEventHandler';
import { DiscordClientProvider, DiscordModule, DiscordModuleOption } from '@discord-nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Intents, PresenceData, WebSocketOptions } from 'discord.js';
import { MessageUtilities } from './Logic/MessageUtilities';
import { ChatCommands } from './Commands/ChatCommands';

@Module({
	imports: [
		DiscordModule.forRootAsync({
			useFactory: (config: ConfigService) => {
				return <DiscordModuleOption>{
					token: config.get<string>('DISCORD_BOT_TOKEN'),
					commands: ['**/*.command.ts', '**/*.command.js'],
					discordClientOptions: {
						intents: [
							Intents.FLAGS.GUILDS,
							Intents.FLAGS.DIRECT_MESSAGES,
							Intents.FLAGS.GUILD_MEMBERS,
							Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
							Intents.FLAGS.GUILD_MESSAGES,
							Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
							Intents.FLAGS.GUILD_INVITES,
							Intents.FLAGS.GUILD_PRESENCES
						],
						shards: 'auto',
						presence: <PresenceData>{ status: 'dnd' }
					},
					registerCommandOptions: [
						{
							forGuild: '851504886854975489'
						}
					]
				};
			},
			inject: [ConfigService]
		})
	],
	providers: [
		{
			provide: 'DiscordEventHandler',
			useClass: DiscordEventHandler
		},
		{
			provide: 'CustomDiscordService',
			useExisting: DiscordClientProvider
		},
		MessageUtilities,
		ChatCommands
	],
	exports: ['CustomDiscordService', MessageUtilities]
})
export class BotModule {}