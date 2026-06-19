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
exports.TaskEngagementService = void 0;
const common_1 = require("@nestjs/common");
const engagement_service_1 = require("../engagement.service");
const enums_1 = require("../../../common/enums");
let TaskEngagementService = class TaskEngagementService {
    engagementService;
    constructor(engagementService) {
        this.engagementService = engagementService;
    }
    async taskCreated(actor, task) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.TASK,
            action: enums_1.ActivityAction.CREATE,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'Tasks',
            title: 'Task Created',
            description: `${actor.name} created task ${task.title}`,
            referenceId: task.id,
            referenceType: 'TASK',
            metadata: {
                title: task.title,
                projectId: task.projectId,
                assignedToUserId: task.assignedToUserId,
            },
        });
    }
    async taskUpdated(actor, task, oldValues, newValues) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.TASK,
            action: enums_1.ActivityAction.UPDATE,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'Tasks',
            title: 'Task Updated',
            description: `${actor.name} updated task ${task.title}`,
            referenceId: task.id,
            referenceType: 'TASK',
            oldValues,
            newValues,
        });
    }
    async taskDeleted(actor, task) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.TASK,
            action: enums_1.ActivityAction.DELETE,
            severity: enums_1.ActivitySeverity.WARNING,
            moduleName: 'Tasks',
            title: 'Task Deleted',
            description: `${actor.name} deleted task ${task.title}`,
            referenceId: task.id,
            referenceType: 'TASK',
            metadata: {
                title: task.title,
            },
        });
    }
};
exports.TaskEngagementService = TaskEngagementService;
exports.TaskEngagementService = TaskEngagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [engagement_service_1.EngagementService])
], TaskEngagementService);
//# sourceMappingURL=task-engagement.service.js.map