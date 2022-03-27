import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../Domain/User/IUserRepository';
import { IUser } from '../../Domain/User/IUser';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserRepository implements IUserRepository {
	constructor(@InjectModel('User') private readonly user) {}

	public async GetById(userId: string): Promise<IUser> {
		return Promise.resolve(undefined);
	}
}