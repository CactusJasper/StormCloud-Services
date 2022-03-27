export interface IUser {
    _id?: string | null;
    created?: Date | null;
    lastUpdated?: Date | null;
    username: string;
    provider: string;
    highest_role: string;
    event_manager: boolean;
    admin: boolean;
    superuser: boolean;
    discordId: string;
    theme: string;
    discord: any;
}