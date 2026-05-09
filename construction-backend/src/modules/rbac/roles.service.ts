import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Role } from './models/role.model';
import { Permission } from './models/permission.model';
import { RolePermission } from './models/role-permission.model';

import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionsDto } from './dto/assign-permission.dto';

@Injectable()
export class RbacService {
  constructor(
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(Permission) private permissionModel: typeof Permission,
    @InjectModel(RolePermission)
    private rolePermissionModel: typeof RolePermission,
  ) {}

  // ================= ROLES =================

  async createRole(dto: CreateRoleDto) {
    const existing = await this.roleModel.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Role name already exists');
    }

    return this.roleModel.create(dto);
  }

  async findAllRoles() {
    return this.roleModel.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findRoleById(id: string) {
    const role = await this.roleModel.findByPk(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  // ================= PERMISSIONS =================

  async createPermission(dto: CreatePermissionDto) {
    const existing = await this.permissionModel.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Permission name already exists');
    }

    return this.permissionModel.create(dto);
  }

  async findAllPermissions() {
    return this.permissionModel.findAll({
      order: [
        ['module', 'ASC'],
        ['action', 'ASC'],
      ],
    });
  }

  // ================= ASSIGN PERMISSIONS =================

  async assignPermissions(roleId: string, dto: AssignPermissionsDto) {
    await this.findRoleById(roleId);

    await this.rolePermissionModel.destroy({
      where: { role_id: roleId },
    });

    const assignments = dto.permission_ids.map((permission_id) => ({
      role_id: roleId,
      permission_id,
    }));

    await this.rolePermissionModel.bulkCreate(assignments);

    return {
      message: 'Permissions assigned successfully',
    };
  }

  // ================= ROLE WITH PERMISSIONS =================

  async getRoleWithPermissions(roleId: string) {
    return this.roleModel.findByPk(roleId, {
      include: [
        {
          model: Permission,
          through: { attributes: [] },
        },
      ],
    });
  }
}
