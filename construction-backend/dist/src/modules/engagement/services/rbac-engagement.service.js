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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacEngagementService = void 0;
const common_1 = require("@nestjs/common");
const engagement_service_1 = require("../engagement.service");
const enums_1 = require("../../../common/enums");
let RbacEngagementService = class RbacEngagementService {
    engagementService;
    constructor(engagementService) {
        this.engagementService = engagementService;
    }
    async roleCreated(actor, role) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.RBAC,
            action: enums_1.ActivityAction.CREATE,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'RBAC',
            title: 'Role Created',
            description: `${actor.name} created role ${role.name}`,
            referenceId: role.id,
            referenceType: 'ROLE',
            metadata: {
                roleName: role.name,
            },
        });
    }
    async permissionCreated(actor, permission) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.RBAC,
            action: enums_1.ActivityAction.CREATE,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'RBAC',
            title: 'Permission Created',
            description: `${actor.name} created permission ${permission.name}`,
            referenceId: permission.id,
            referenceType: 'PERMISSION',
            metadata: {
                permissionName: permission.name,
                module: permission.module,
                action: permission.action,
            },
        });
    }
    async permissionsAssigned(actor, role, permissionIds) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.RBAC,
            action: enums_1.ActivityAction.UPDATE,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'RBAC',
            title: 'Permissions Assigned',
            description: `${actor.name} assigned permissions to role ${role.name}`,
            referenceId: role.id,
            referenceType: 'ROLE',
            metadata: {
                roleName: role.name,
                permissionCount: permissionIds.length,
            },
        });
    }
};
exports.RbacEngagementService = RbacEngagementService;
exports.RbacEngagementService = RbacEngagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [engagement_service_1.EngagementService])
], RbacEngagementService);
//# sourceMappingURL=rbac-engagement.service.js.map