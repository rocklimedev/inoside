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
exports.UserEngagementService = void 0;
const common_1 = require("@nestjs/common");
const engagement_service_1 = require("../engagement.service");
const enums_1 = require("../../../common/enums");
let UserEngagementService = class UserEngagementService {
    engagementService;
    constructor(engagementService) {
        this.engagementService = engagementService;
    }
    async userCreated(actor, user) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.USER,
            action: enums_1.ActivityAction.CREATE,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'Users',
            title: 'User Created',
            description: `${actor.name} created user ${user.name}`,
            referenceId: user.id,
            referenceType: 'USER',
            metadata: {
                name: user.name,
                email: user.email,
            },
        });
    }
    async userUpdated(actor, user, oldValues, newValues) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.USER,
            action: enums_1.ActivityAction.UPDATE,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'Users',
            title: 'User Updated',
            description: `${actor.name} updated user ${user.name}`,
            referenceId: user.id,
            referenceType: 'USER',
            oldValues,
            newValues,
        });
    }
    async userDeleted(actor, user) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.USER,
            action: enums_1.ActivityAction.DELETE,
            severity: enums_1.ActivitySeverity.WARNING,
            moduleName: 'Users',
            title: 'User Deleted',
            description: `${actor.name} deleted user ${user.name}`,
            referenceId: user.id,
            referenceType: 'USER',
            metadata: {
                name: user.name,
            },
        });
    }
    async userStatusChanged(actor, user) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.USER,
            action: enums_1.ActivityAction.UPDATE,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'Users',
            title: user.isActive ? 'User Activated' : 'User Deactivated',
            description: `${actor.name} ${user.isActive ? 'activated' : 'deactivated'} user ${user.name}`,
            referenceId: user.id,
            referenceType: 'USER',
            metadata: {
                isActive: user.isActive,
            },
        });
    }
};
exports.UserEngagementService = UserEngagementService;
exports.UserEngagementService = UserEngagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [engagement_service_1.EngagementService])
], UserEngagementService);
//# sourceMappingURL=user-engagement.service.js.map