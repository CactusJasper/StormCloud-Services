import { Provider } from '@nestjs/common';
import { UserRepository } from './UserRepository';

export const UserRepositoryProvider: Provider = {
	provide: 'UserRepository',
	useClass: UserRepository
}