import { Role } from './models/role.model';
import { Permission } from './models/permission.model';
import { RolePermission } from './models/role-permission.model';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionsDto } from './dto/assign-permission.dto';
export declare class RbacService {
    private roleModel;
    private permissionModel;
    private rolePermissionModel;
    constructor(roleModel: typeof Role, permissionModel: typeof Permission, rolePermissionModel: typeof RolePermission);
    createRole(dto: CreateRoleDto): Promise<Role>;
    findAllRoles(): Promise<Role[]>;
    findRoleById(id: string): Promise<Role>;
    createPermission(dto: CreatePermissionDto): Promise<Permission>;
    findAllPermissions(): Promise<Permission[]>;
    assignPermissions(roleId: string, dto: AssignPermissionsDto): Promise<{
        message: string;
    }>;
    getRoleWithPermissions(roleId: string): Promise<Role | null>;
}
