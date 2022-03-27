import { Module } from '@nestjs/common';
import { UserRepositoryModule } from './User/UserRepository.module';

@Module({
    imports: [UserRepositoryModule],
    providers: [],
    exports: [UserRepositoryModule]
})
export class PersistenceModule {}