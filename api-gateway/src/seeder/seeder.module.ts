
import { Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/v1/users/users.module';
import { UserSeeder } from './user.seeder';

@Module({
  imports: [UsersModule],
  providers: [UserSeeder],
  exports: [UserSeeder],
})
export class SeederModule {}
