import { Module } from '@nestjs/common';
import { UserRepositoryModule } from '../../Persistence/User/UserRepository.module';

@Module({
	imports: [UserRepositoryModule],
	providers: [],
	exports: []
})
export class UserModule {}