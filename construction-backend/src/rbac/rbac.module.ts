import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesController } from './roles.controller';
import { RolesService } from './roles.service'; // ✅ IMPORT THIS
import { UsersModule } from '../users/users.module';
import { RolesGuard } from './guards/roles.guard';

import { Role } from './entities/role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Permission } from './entities/permission.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Role, RolePermission, Permission]),
  ],
  controllers: [RolesController],
  providers: [RolesService, RolesGuard], // ✅ ADD HERE
  exports: [RolesService, RolesGuard], // ✅ (optional but recommended)
})
export class RbacModule {}
