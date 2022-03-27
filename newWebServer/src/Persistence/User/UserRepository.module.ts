import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './User.entity';
import { UserRepositoryProvider } from './UserRepository.provider';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
	providers: [UserRepositoryProvider],
	exports: [UserRepositoryProvider]
})
export class UserRepositoryModule {}