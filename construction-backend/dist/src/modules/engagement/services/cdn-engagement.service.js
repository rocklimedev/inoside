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
exports.CdnEngagementService = void 0;
const common_1 = require("@nestjs/common");
const engagement_service_1 = require("../engagement.service");
const enums_1 = require("../../../common/enums");
let CdnEngagementService = class CdnEngagementService {
    engagementService;
    constructor(engagementService) {
        this.engagementService = engagementService;
    }
    async fileUploaded(actor, file) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.CDN,
            action: enums_1.ActivityAction.CREATE,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'CDN',
            title: 'File Uploaded',
            description: `${actor.name} uploaded file ${file.originalName || file.filename}`,
            referenceId: file.filename,
            referenceType: 'CDN_FILE',
            metadata: {
                filename: file.filename,
                originalName: file.originalName,
                url: file.url,
                size: file.size,
                mimeType: file.mimeType,
            },
        });
    }
    async fileViewed(actor, file) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.CDN,
            action: enums_1.ActivityAction.VIEW,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'CDN',
            title: 'File Viewed',
            description: `${actor.name} viewed file ${file.filename}`,
            referenceId: file.filename,
            referenceType: 'CDN_FILE',
            metadata: {
                url: file.url,
            },
        });
    }
    async fileUpdated(actor, file, oldValues, newValues) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.CDN,
            action: enums_1.ActivityAction.UPDATE,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'CDN',
            title: 'File Updated',
            description: `${actor.name} updated file ${file.filename}`,
            referenceId: file.filename,
            referenceType: 'CDN_FILE',
            oldValues,
            newValues,
        });
    }
    async fileDeleted(actor, file) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.CDN,
            action: enums_1.ActivityAction.DELETE,
            severity: enums_1.ActivitySeverity.WARNING,
            moduleName: 'CDN',
            title: 'File Deleted',
            description: `${actor.name} deleted file ${file.filename}`,
            referenceId: file.filename,
            referenceType: 'CDN_FILE',
            metadata: {
                filename: file.filename,
                url: file.url,
            },
        });
    }
    async uploadFailed(actor, filename, error) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.CDN,
            action: enums_1.ActivityAction.CREATE,
            severity: enums_1.ActivitySeverity.ERROR,
            moduleName: 'CDN',
            title: 'File Upload Failed',
            description: `${actor.name} failed to upload file ${filename}`,
            metadata: {
                filename,
                error,
            },
        });
    }
};
exports.CdnEngagementService = CdnEngagementService;
exports.CdnEngagementService = CdnEngagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [engagement_service_1.EngagementService])
], CdnEngagementService);
//# sourceMappingURL=cdn-engagement.service.js.map