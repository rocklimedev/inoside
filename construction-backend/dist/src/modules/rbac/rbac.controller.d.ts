import { RbacService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionsDto } from './dto/assign-permission.dto';
export declare class RbacController {
    private readonly rbacService;
    constructor(rbacService: RbacService);
    findAllRoles(): Promise<import("./models/role.model").Role[]>;
    createRole(dto: CreateRoleDto, req: any): Promise<import("./models/role.model").Role>;
    findRoleById(id: string): Promise<import("./models/role.model").Role>;
    getRoleWithPermissions(id: string): Promise<import("./models/role.model").Role>;
    createPermission(dto: CreatePermissionDto, req: any): Promise<import("./models/permission.model").Permission>;
    findAllPermissions(): Promise<import("./models/permission.model").Permission[]>;
    assignPermissions(roleId: string, dto: AssignPermissionsDto, req: any): Promise<{
        message: string;
    }>;
    getMyPermissions(req: any): {
        role: any;
        permissions: any;
    };
}
