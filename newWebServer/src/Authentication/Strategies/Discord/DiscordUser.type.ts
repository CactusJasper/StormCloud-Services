export type DiscordUser = {
	id: string;
	username: string;
	avatar: string | null;
	discriminator: string;
	public_flags: number;
	flags: number;
	banner: string | null;
	banner_color: string;
	accent_color: number;
	locale: string;
	mfa_enabled: boolean;
}