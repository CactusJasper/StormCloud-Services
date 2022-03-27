import { Schema } from 'mongoose';
import { IUser } from '../../Domain/User/IUser';

export const UserSchema: Schema = new Schema(
    {
        _id: { type: Schema.Types.ObjectId, required: true, auto: true },
        username: { type: String, required: true},
        provider: { type: String, default: 'discord'},
        highest_role: { type: String },
        event_manager: { type: Boolean, default: false },
        admin: { type: Boolean, default: false },
        superuser: { type: Boolean, default: false },
        discordId: { type: String},
        theme: { type: String, default: 'dark' },
        discord: {}
    },
    { timestamps: { createdAt: 'created', updatedAt: 'lastUpdated' }}
);

export interface IUserEntity extends Omit<IUser, '_id'> {}