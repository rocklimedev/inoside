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
exports.ActivityLogController = void 0;
const common_1 = require("@nestjs/common");
const activity_log_service_1 = require("./activity-log.service");
let ActivityLogController = class ActivityLogController {
    activityLogService;
    constructor(activityLogService) {
        this.activityLogService = activityLogService;
    }
    async getLogs(page = 1, limit = 20) {
        return this.activityLogService.getLogs(Number(page), Number(limit));
    }
    async getStats() {
        return this.activityLogService.getStats();
    }
    async getRecent(limit = 50) {
        return this.activityLogService.getRecent(Number(limit));
    }
    async search(userId, moduleName, contextTag, action, severity, referenceId, startDate, endDate, page = 1, limit = 20) {
        return this.activityLogService.search({
            userId,
            moduleName,
            contextTag,
            action,
            severity,
            referenceId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            page: Number(page),
            limit: Number(limit),
        });
    }
    async getById(activityLogId) {
        return this.activityLogService.findById(activityLogId);
    }
    async getByUser(userId, page = 1, limit = 20) {
        return this.activityLogService.findByUserId(userId, Number(page), Number(limit));
    }
    async getByModule(moduleName, page = 1, limit = 20) {
        return this.activityLogService.findByModule(moduleName, Number(page), Number(limit));
    }
    async getBySeverity(severity, page = 1, limit = 20) {
        return this.activityLogService.findBySeverity(severity, Number(page), Number(limit));
    }
    async delete(activityLogId) {
        return this.activityLogService.delete(activityLogId);
    }
};
exports.ActivityLogController = ActivityLogController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('recent'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "getRecent", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('moduleName')),
    __param(2, (0, common_1.Query)('contextTag')),
    __param(3, (0, common_1.Query)('action')),
    __param(4, (0, common_1.Query)('severity')),
    __param(5, (0, common_1.Query)('referenceId')),
    __param(6, (0, common_1.Query)('startDate')),
    __param(7, (0, common_1.Query)('endDate')),
    __param(8, (0, common_1.Query)('page')),
    __param(9, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':activityLogId'),
    __param(0, (0, common_1.Param)('activityLogId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "getByUser", null);
__decorate([
    (0, common_1.Get)('module/:moduleName'),
    __param(0, (0, common_1.Param)('moduleName')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "getByModule", null);
__decorate([
    (0, common_1.Get)('severity/:severity'),
    __param(0, (0, common_1.Param)('severity')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "getBySeverity", null);
__decorate([
    (0, common_1.Delete)(':activityLogId'),
    __param(0, (0, common_1.Param)('activityLogId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "delete", null);
exports.ActivityLogController = ActivityLogController = __decorate([
    (0, common_1.Controller)('activity-logs'),
    __metadata("design:paramtypes", [activity_log_service_1.ActivityLogService])
], ActivityLogController);
//# sourceMappingURL=activity-log.controller.js.map