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
exports.AuthEngagementService = void 0;
const common_1 = require("@nestjs/common");
const engagement_service_1 = require("../engagement.service");
const enums_1 = require("../../../common/enums");
let AuthEngagementService = class AuthEngagementService {
    engagementService;
    constructor(engagementService) {
        this.engagementService = engagementService;
    }
    async userRegistered(user) {
        return this.engagementService.audit({
            actor: {
                userId: user.id,
                userName: user.name,
            },
            contextTag: enums_1.ContextTag.AUTH,
            action: enums_1.ActivityAction.CREATE,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'Auth',
            title: 'User Registered',
            description: `${user.name} registered successfully`,
            referenceId: user.id,
            referenceType: 'USER',
            metadata: {
                email: user.email,
                role: user.role,
            },
        });
    }
    async loginSuccess(user) {
        return this.engagementService.audit({
            actor: {
                userId: user.id,
                userName: user.name,
            },
            contextTag: enums_1.ContextTag.AUTH,
            action: enums_1.ActivityAction.LOGIN,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'Auth',
            title: 'User Logged In',
            description: `${user.name} logged in successfully`,
            referenceId: user.id,
            referenceType: 'USER',
            metadata: {
                email: user.email,
                role: user.role,
            },
        });
    }
    async loginFailed(email) {
        return this.engagementService.audit({
            contextTag: enums_1.ContextTag.AUTH,
            action: enums_1.ActivityAction.LOGIN,
            severity: enums_1.ActivitySeverity.WARNING,
            moduleName: 'Auth',
            title: 'Failed Login Attempt',
            description: `Login failed for email ${email}`,
            metadata: {
                email,
            },
        });
    }
    async loginBlocked(user) {
        return this.engagementService.audit({
            actor: {
                userId: user.id,
                userName: user.name,
            },
            contextTag: enums_1.ContextTag.AUTH,
            action: enums_1.ActivityAction.LOGIN,
            severity: enums_1.ActivitySeverity.WARNING,
            moduleName: 'Auth',
            title: 'Inactive User Login Attempt',
            description: `${user.name} attempted login while account is inactive`,
            referenceId: user.id,
            referenceType: 'USER',
        });
    }
    async logout(user) {
        return this.engagementService.audit({
            actor: {
                userId: user.id,
                userName: user.name,
            },
            contextTag: enums_1.ContextTag.AUTH,
            action: enums_1.ActivityAction.LOGOUT,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'Auth',
            title: 'User Logged Out',
            description: `${user.name} logged out`,
            referenceId: user.id,
            referenceType: 'USER',
        });
    }
    async passwordReset(user) {
        return this.engagementService.audit({
            actor: {
                userId: user.id,
                userName: user.name,
            },
            contextTag: enums_1.ContextTag.AUTH,
            action: enums_1.ActivityAction.UPDATE,
            severity: enums_1.ActivitySeverity.WARNING,
            moduleName: 'Auth',
            title: 'Password Reset',
            description: `${user.name} reset password`,
            referenceId: user.id,
            referenceType: 'USER',
        });
    }
};
exports.AuthEngagementService = AuthEngagementService;
exports.AuthEngagementService = AuthEngagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [engagement_service_1.EngagementService])
], AuthEngagementService);
//# sourceMappingURL=auth-engagement.service.js.map