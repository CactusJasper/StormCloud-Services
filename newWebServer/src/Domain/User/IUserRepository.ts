import { Inject } from '@nestjs/common';
import { IUser } from './IUser';

export interface IUserRepository {
	GetById(userId: string): Promise<IUser>;
}
export const UserRepository = (): any => Inject('UserRepository');