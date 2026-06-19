import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { User } from './models/user.model';
import { Role } from '../rbac/models/role.model';
import { CdnModule } from '../cdn/cdn.module';
import { EngagementModule } from '../engagement/engagement.module';
@Module({
  imports: [
    SequelizeModule.forFeature([User, Role]),
    CdnModule, // ✅ THIS IS REQUIRED
    EngagementModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
