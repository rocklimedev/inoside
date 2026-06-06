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
exports.EngagementService = void 0;
const common_1 = require("@nestjs/common");
const activity_log_service_1 = require("../activity-log/activity-log.service");
const notifications_service_1 = require("../notifications/service/notifications.service");
const enums_1 = require("../../common/enums");
let EngagementService = class EngagementService {
    activityLogService;
    notificationsService;
    constructor(activityLogService, notificationsService) {
        this.activityLogService = activityLogService;
        this.notificationsService = notificationsService;
    }
    async audit(payload) {
        return this.activityLogService.create({
            userId: payload.actor?.userId,
            userName: payload.actor?.userName,
            contextTag: payload.contextTag,
            action: payload.action,
            severity: payload.severity ?? enums_1.ActivitySeverity.INFO,
            title: payload.title,
            description: payload.description,
            moduleName: payload.moduleName,
            referenceId: payload.referenceId,
            referenceType: payload.referenceType,
            metadata: payload.metadata,
            oldValues: payload.oldValues,
            newValues: payload.newValues,
        });
    }
    async notify(payload) {
        return this.notificationsService.create({
            userId: payload.recipientUserId,
            title: payload.title,
            message: payload.message,
            unread: true,
            type: payload.type,
            category: payload.category,
            meta: payload.meta,
        });
    }
    async auditAndNotify(payload) {
        const audit = await this.audit(payload.audit);
        const notification = await this.notify(payload.notification);
        return {
            audit,
            notification,
        };
    }
};
exports.EngagementService = EngagementService;
exports.EngagementService = EngagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [activity_log_service_1.ActivityLogService,
        notifications_service_1.NotificationsService])
], EngagementService);
//# sourceMappingURL=engagement.service.js.map