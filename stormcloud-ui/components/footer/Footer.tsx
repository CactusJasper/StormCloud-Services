import * as React from 'react';
import Image from 'next/image';
import discordLogo from '../../public/images/discord_logo.png';

export const Footer: React.FC = (): JSX.Element => {
    return (
        <footer className="flex">
            <div className="start">
                <a href="https://discord.gg/Vnrb6scBHG"><Image src={discordLogo} width="40" height="32" layout="intrinsic"/></a>
            </div>
            <div className="end">
                <a href="/content-policy">Content Policy</a>
                <a href="/cookie-policy">Cookie Policy</a>
                <a href="/privacy-policy">Privacy Policy</a>
                <p>&copy; 2021 𝕵𝖆𝖘𝖕𝖊𝖗</p>
            </div>
        </footer>
    );
}