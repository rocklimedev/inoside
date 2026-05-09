import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RbacService } from './roles.service';
import { Role } from './models/role.model';
import { Permission } from './models/permission.model';
import { RolePermission } from './models/role-permission.model';

@Module({
  imports: [SequelizeModule.forFeature([Role, Permission, RolePermission])],
  providers: [RbacService],
  exports: [RbacService],
})
export class RbacModule {}
