import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RbacService } from './roles.service';
import { Role } from './models/role.model';
import { Permission } from './models/permission.model';
import { RolePermission } from './models/role-permission.model';
import { RbacController } from './rbac.controller';
import { EngagementModule } from '../engagement/engagement.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Role, Permission, RolePermission]),
    EngagementModule,
  ],
  controllers: [RbacController],
  providers: [RbacService],
  exports: [RbacService],
})
export class RbacModule {}
