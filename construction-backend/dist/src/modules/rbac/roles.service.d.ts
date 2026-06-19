import { Role } from './models/role.model';
import { Permission } from './models/permission.model';
import { RolePermission } from './models/role-permission.model';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionsDto } from './dto/assign-permission.dto';
import { RbacEngagementService } from '../engagement/services/rbac-engagement.service';
export declare class RbacService {
    private roleModel;
    private permissionModel;
    private rolePermissionModel;
    private readonly rbacEngagementService;
    constructor(roleModel: typeof Role, permissionModel: typeof Permission, rolePermissionModel: typeof RolePermission, rbacEngagementService: RbacEngagementService);
    createRole(dto: CreateRoleDto, actor: {
        id: string;
        name: string;
    }): Promise<Role>;
    findAllRoles(): Promise<Role[]>;
    findRoleById(id: string): Promise<Role>;
    createPermission(dto: CreatePermissionDto, actor: {
        id: string;
        name: string;
    }): Promise<Permission>;
    findAllPermissions(): Promise<Permission[]>;
    assignPermissions(roleId: string, dto: AssignPermissionsDto, actor: {
        id: string;
        name: string;
    }): Promise<{
        message: string;
    }>;
    getRoleWithPermissions(roleId: string): Promise<Role>;
}
