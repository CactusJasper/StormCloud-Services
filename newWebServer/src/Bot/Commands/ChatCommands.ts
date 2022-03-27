import { Injectable } from '@nestjs/common';
import { GuildMember, Message, MessageEmbed, MessagePayload, Role, User } from 'discord.js';
import { APIUser } from 'discord-api-types/payloads/v9/user';
import { DiscordConversionUtilities } from '../../Utilities/DiscordHelpers/DiscordConversionUtilities';
import { DiscordGetUtilities } from '../../Utilities/DiscordHelpers/DiscordGetUtilities';

@Injectable()
export class ChatCommands {
	constructor() {}

	public async ProfileCommand(message: Message): Promise<void> {
		const embed: MessageEmbed = new MessageEmbed();
		const user: User | APIUser = message.author;
		const guildMember: GuildMember = DiscordGetUtilities.GetGuildMember(message.guild, user.id, message);
		const highestRole: Role = guildMember.roles.highest;
		const dateJoined: Date = new Date(guildMember.joinedTimestamp);
		embed.setColor('#790E8B');
		embed.setTitle('User Profile');
		embed.setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`);
		embed.setFields([
			{
				name: 'Highest Role',
				inline: true,
				value: highestRole.name
			},
			{
				name: 'Account Flags',
				value: DiscordConversionUtilities.ConvertBitFieldToString(user.flags.valueOf())
			},
			{
				name: 'Date Joined',
				value: `${dateJoined.toDateString()}`
			}
		]);
		embed.setAuthor(`${guildMember.displayName}#${user.discriminator}`);
		message.channel.send(new MessagePayload(message.channel, { embeds: [embed] }));
	}
}