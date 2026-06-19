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
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  // =========================================================
  // ROLES
  // =========================================================

  // PUBLIC (used in register page)
  @Get('roles')
  findAllRoles() {
    return this.rbacService.findAllRoles();
  }

  // ADMIN ONLY
  @Post('roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createRole(@Body() dto: CreateRoleDto, @Request() req) {
    return this.rbacService.createRole(dto, {
      id: req.user.id,
      name: req.user.name,
    });
  }

  // ADMIN ONLY
  @Get('roles/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findRoleById(@Param('id') id: string) {
    return this.rbacService.findRoleById(id);
  }

  // ADMIN ONLY
  @Get('roles/:id/permissions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getRoleWithPermissions(@Param('id') id: string) {
    return this.rbacService.getRoleWithPermissions(id);
  }

  // =========================================================
  // PERMISSIONS
  // =========================================================

  // ADMIN ONLY
  @Post('permissions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createPermission(@Body() dto: CreatePermissionDto, @Request() req) {
    return this.rbacService.createPermission(dto, {
      id: req.user.id,
      name: req.user.name,
    });
  }

  // ADMIN ONLY
  @Get('permissions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAllPermissions() {
    return this.rbacService.findAllPermissions();
  }

  // =========================================================
  // ASSIGN PERMISSIONS
  // =========================================================

  // ADMIN ONLY
  @Post('roles/:id/permissions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  assignPermissions(
    @Param('id') roleId: string,
    @Body() dto: AssignPermissionsDto,
    @Request() req,
  ) {
    return this.rbacService.assignPermissions(roleId, dto, {
      id: req.user.id,
      name: req.user.name,
    });
  }

  // =========================================================
  // CURRENT USER
  // =========================================================

  @Get('me/permissions')
  @UseGuards(JwtAuthGuard)
  getMyPermissions(@Request() req) {
    return {
      role: req.user.role,
      permissions: req.user.permissions || [],
    };
  }
}
