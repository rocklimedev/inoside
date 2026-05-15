"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const role_model_1 = require("./models/role.model");
const permission_model_1 = require("./models/permission.model");
const role_permission_model_1 = require("./models/role-permission.model");
let RbacService = class RbacService {
    roleModel;
    permissionModel;
    rolePermissionModel;
    constructor(roleModel, permissionModel, rolePermissionModel) {
        this.roleModel = roleModel;
        this.permissionModel = permissionModel;
        this.rolePermissionModel = rolePermissionModel;
    }
    async createRole(dto) {
        const existing = await this.roleModel.findOne({
            where: { name: dto.name },
        });
        if (existing) {
            throw new common_1.ConflictException('Role name already exists');
        }
        return this.roleModel.create(dto);
    }
    async findAllRoles() {
        return this.roleModel.findAll({
            order: [['name', 'ASC']],
        });
    }
    async findRoleById(id) {
        const role = await this.roleModel.findByPk(id);
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        return role;
    }
    async createPermission(dto) {
        const existing = await this.permissionModel.findOne({
            where: { name: dto.name },
        });
        if (existing) {
            throw new common_1.ConflictException('Permission name already exists');
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
    async assignPermissions(roleId, dto) {
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
    async getRoleWithPermissions(roleId) {
        return this.roleModel.findByPk(roleId, {
            include: [
                {
                    model: permission_model_1.Permission,
                    through: { attributes: [] },
                },
            ],
        });
    }
};
exports.RbacService = RbacService;
exports.RbacService = RbacService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(role_model_1.Role)),
    __param(1, (0, sequelize_1.InjectModel)(permission_model_1.Permission)),
    __param(2, (0, sequelize_1.InjectModel)(role_permission_model_1.RolePermission)),
    __metadata("design:paramtypes", [Object, Object, Object])
], RbacService);
//# sourceMappingURL=roles.service.js.map