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
exports.SiteEngagementService = void 0;
const common_1 = require("@nestjs/common");
const engagement_service_1 = require("../engagement.service");
const enums_1 = require("../../../common/enums");
let SiteEngagementService = class SiteEngagementService {
    engagementService;
    constructor(engagementService) {
        this.engagementService = engagementService;
    }
    async siteCreated(actor, site) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.SITE,
            action: enums_1.ActivityAction.CREATE,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'Sites',
            title: 'Site Created',
            description: `${actor.name} created a site`,
            referenceId: site.id,
            referenceType: 'SITE',
            metadata: {
                clientId: site.clientId,
            },
        });
    }
    async siteUpdated(actor, site, oldValues, newValues) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.SITE,
            action: enums_1.ActivityAction.UPDATE,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'Sites',
            title: 'Site Updated',
            description: `${actor.name} updated a site`,
            referenceId: site.id,
            referenceType: 'SITE',
            oldValues,
            newValues,
            metadata: {
                clientId: site.clientId,
            },
        });
    }
    async siteDeleted(actor, site) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.SITE,
            action: enums_1.ActivityAction.DELETE,
            severity: enums_1.ActivitySeverity.WARNING,
            moduleName: 'Sites',
            title: 'Site Deleted',
            description: `${actor.name} deleted a site`,
            referenceId: site.id,
            referenceType: 'SITE',
            metadata: {
                clientId: site.clientId,
            },
        });
    }
};
exports.SiteEngagementService = SiteEngagementService;
exports.SiteEngagementService = SiteEngagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [engagement_service_1.EngagementService])
], SiteEngagementService);
//# sourceMappingURL=site-engagement.service.js.map