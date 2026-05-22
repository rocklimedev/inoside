import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { User } from './models/user.model';
import { Role } from '../rbac/models/role.model';
import { CdnModule } from '../cdn/cdn.module';
@Module({
  imports: [
    SequelizeModule.forFeature([User, Role]),
    CdnModule, // ✅ THIS IS REQUIRED
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
