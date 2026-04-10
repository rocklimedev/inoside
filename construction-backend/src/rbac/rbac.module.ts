import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesController } from './roles.controller';
import { UsersModule } from '../users/users.module';
import { RolesGuard } from './guards/roles.guard';

import { Role } from './entities/role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Permission } from './entities/permission.entity'; // if you have this

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      Role,
      RolePermission,
      Permission, // keep if exists
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesGuard],
  exports: [RolesGuard, TypeOrmModule], // export if used elsewhere
})
export class RbacModule {}
