import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  BadRequestException,
  Post,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { RolesService } from './roles.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

import { Role } from './entities/role.entity';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService, // ✅ FIXED
    private readonly usersService: UsersService,
  ) {}

  // =============================================
  // CREATE ROLE
  // =============================================
  @Post()
  async createRole(@Body() dto: CreateRoleDto) {
    const role = await this.rolesService.createRole(dto);

    return {
      success: true,
      message: 'Role created successfully',
      data: role,
    };
  }

  // =============================================
  // GET ALL ROLES
  // =============================================
  @Get()
  async getAllRoles() {
    const roles = await this.rolesService.findAll(); // ✅ FIXED

    return {
      success: true,
      data: roles.map((role: Role) => ({
        id: role.id,
        name: role.name,
        display_name: role.display_name,
        description: role.description,
      })),
      count: roles.length,
    };
  }

  // =============================================
  // ROLE STATISTICS
  // =============================================
  @Get('stats')
  async getRoleStats() {
    const roles = await this.rolesService.findAll(); // ✅ FIXED

    const stats = await Promise.all(
      roles.map(async (role: Role) => {
        const count = await this.usersService.countByRoleId(role.id);
        const activeCount = await this.usersService.countActiveByRoleId(
          role.id,
        );

        return {
          role: {
            id: role.id,
            name: role.name,
          },
          count,
          activeCount,
        };
      }),
    );

    return {
      success: true,
      totalUsers: stats.reduce((sum, s) => sum + s.count, 0),
      data: stats,
    };
  }

  // =============================================
  // GET USERS BY ROLE ID
  // =============================================
  @Get(':roleId')
  async getUsersByRole(@Param('roleId') roleId: number) {
    const users = await this.usersService.findByRoleId(roleId);

    return {
      success: true,
      roleId,
      count: users.length,
      data: users.map((user) => ({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        preferred_comm: user.preferred_comm,
        is_active: user.is_active,
        created_at: user.created_at,
        role: user.role?.name,
      })),
    };
  }

  // =============================================
  // CHANGE USER ROLE
  // =============================================
  @Patch(':userId/role')
  async updateUserRole(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    const { roleId } = dto;

    // 1. Fetch user
    const user = await this.usersService.findOne(userId);

    // 2. Fetch role from RolesService ✅ FIXED
    const role = await this.rolesService.findById(roleId);

    // 3. Prevent removing last admin
    if (user.role?.name === 'admin' && role.name !== 'admin') {
      const adminCount = await this.usersService.countAdmins();

      if (adminCount <= 1) {
        throw new BadRequestException('Cannot remove the last admin');
      }
    }

    // 4. Update role
    const updatedUser = await this.usersService.updateUserRole(userId, roleId);

    return {
      success: true,
      message: `User role updated to ${role.name}`,
      data: {
        userId: updatedUser.id,
        full_name: updatedUser.full_name,
        previousRole: user.role?.name,
        newRole: updatedUser.role?.name,
      },
    };
  }

  // =============================================
  // ACTIVATE USER
  // =============================================
  @Patch(':userId/activate')
  async activateUser(@Param('userId') userId: string) {
    const user = await this.usersService.activateUser(userId);

    return {
      success: true,
      message: `User ${user.full_name} activated`,
      data: { id: user.id, is_active: user.is_active },
    };
  }

  // =============================================
  // DEACTIVATE USER
  // =============================================
  @Patch(':userId/deactivate')
  async deactivateUser(@Param('userId') userId: string) {
    const user = await this.usersService.deactivateUser(userId);

    return {
      success: true,
      message: `User ${user.full_name} deactivated`,
      data: { id: user.id, is_active: user.is_active },
    };
  }
}
