// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { Role } from '../rbac/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address, Role])],
  controllers: [UsersController],
  providers: [UsersService],

  // ✅ FIX IS HERE
  exports: [
    UsersService,
    TypeOrmModule, // 🔥 THIS is what you were missing
  ],
})
export class UsersModule {}
