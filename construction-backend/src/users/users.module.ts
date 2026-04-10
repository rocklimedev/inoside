import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { Role } from '../rbac/entities/role.entity'; // 👈 important

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Address,
      Role, // 👈 THIS IS REQUIRED
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
