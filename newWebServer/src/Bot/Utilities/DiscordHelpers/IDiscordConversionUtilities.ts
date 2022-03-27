import { Inject } from '@nestjs/common';

export interface IDiscordConversionUtilities {
	ConvertBitFieldToString(bitValue: number): string;
}

export const DiscordConversionUtilities = (): any => Inject('DiscordConversionUtilities');