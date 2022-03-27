import { BaseGuildTextChannel, Guild, GuildMember, Message, Role } from 'discord.js';
import { DiscordCommandException } from './DiscordCommandException';

export class DiscordGetUtilities {
	public static GetGuildMember(guild: Guild, memberId: string, message: Message): GuildMember {
		const guildMember: GuildMember = guild.members.cache.find((member: GuildMember) => member.id === memberId);
		if(!guildMember)
			throw new DiscordCommandException(
				'profile',
				`Unable to find member by the id of ${memberId}`,
				message.channel instanceof BaseGuildTextChannel ? message.channel : null);
		return guildMember;
	}
}