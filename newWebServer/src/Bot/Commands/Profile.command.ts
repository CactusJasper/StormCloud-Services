import { Command, DiscordCommand } from '@discord-nestjs/core';
import { CommandInteraction, GuildMember, MessageEmbed, MessagePayload, Role, User } from 'discord.js';
import { APIUser } from 'discord-api-types/payloads/v9/user';
import { DiscordConversionUtilities } from '../../Utilities/DiscordHelpers/DiscordConversionUtilities';

@Command({
	name: 'profile',
	description: 'Displays your current user information.'
})
export class ProfileCommand implements DiscordCommand {
	constructor() {}

	public async handler(interaction: CommandInteraction): Promise<MessagePayload> {
		const embed: MessageEmbed = new MessageEmbed();
		const user: User | APIUser = interaction.member.user;
		const guildMember: GuildMember = interaction.guild.members.cache.find((member: GuildMember) => member.id === user.id);
		const highestRole: Role = guildMember.roles.highest;
		const dateJoined: Date = new Date(guildMember.guild.joinedTimestamp);
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
		return new MessagePayload(interaction.channel, { embeds: [embed] });
	}

	public static ConvertBitFieldToString(bitValue: number): string {
		switch(bitValue) {
			case 0: return 'None';
			case 1: return 'Staff';
			case 2: return 'Partner';
			case 4: return 'Hypesquad';
			case 8: return 'BugHunterLevel1';
			case 64: return 'HypeSquadOnlineHouse1';
			case 128: return 'HypeSquadOnlineHouse2';
			case 256: return 'HypeSquadOnlineHouse3';
			case 512: return 'PremiumEarlySupporter';
			case 1024: return 'TeamPseudoUser';
			case 16384: return 'BugHunterLevel2';
			case 65536: return 'VerifiedBot';
			case 131072: return 'VerifiedDeveloper';
			case 262144: return 'CertifiedModerator';
			case 524288: return 'BotHTTPInteractions';
		}
	}
}