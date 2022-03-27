export class DiscordConversionUtilities {
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