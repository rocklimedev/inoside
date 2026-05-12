import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RbacService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionsDto } from './dto/assign-permission.dto';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('rbac')
@UseGuards(JwtAuthGuard)
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  // ====================== ROLES ======================

  @Post('roles')
  @UseGuards(RolesGuard)
  @Roles('admin')
  createRole(@Body() dto: CreateRoleDto) {
    return this.rbacService.createRole(dto);
  }

  @Get('roles')
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAllRoles() {
    return this.rbacService.findAllRoles();
  }

  @Get('roles/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  findRoleById(@Param('id') id: string) {
    return this.rbacService.findRoleById(id);
  }

  @Get('roles/:id/permissions')
  @UseGuards(RolesGuard)
  @Roles('admin')
  getRoleWithPermissions(@Param('id') id: string) {
    return this.rbacService.getRoleWithPermissions(id);
  }

  // ====================== PERMISSIONS ======================

  @Post('permissions')
  @UseGuards(RolesGuard)
  @Roles('admin')
  createPermission(@Body() dto: CreatePermissionDto) {
    return this.rbacService.createPermission(dto);
  }

  @Get('permissions')
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAllPermissions() {
    return this.rbacService.findAllPermissions();
  }

  // ====================== ASSIGN PERMISSIONS ======================

  @Post('roles/:id/permissions')
  @UseGuards(RolesGuard)
  @Roles('admin')
  assignPermissions(
    @Param('id') roleId: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.rbacService.assignPermissions(roleId, dto);
  }

  // ====================== UTILITY ======================

  @Get('me/permissions')
  getMyPermissions(@Request() req) {
    return {
      role: req.user.role,
      permissions: req.user.permissions || [],
    };
  }
}
