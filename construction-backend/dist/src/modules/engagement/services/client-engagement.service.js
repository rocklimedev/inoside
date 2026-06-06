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
exports.ClientEngagementService = void 0;
const common_1 = require("@nestjs/common");
const engagement_service_1 = require("../engagement.service");
const enums_1 = require("../../../common/enums");
let ClientEngagementService = class ClientEngagementService {
    engagementService;
    constructor(engagementService) {
        this.engagementService = engagementService;
    }
    async clientCreated(actor, client) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.CLIENT,
            action: enums_1.ActivityAction.CREATE,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'Clients',
            title: 'Client Created',
            description: `${actor.name} created client ${client.name}`,
            referenceId: client.id,
            referenceType: 'CLIENT',
            metadata: {
                clientName: client.name,
                email: client.email,
                companyName: client.company_name,
            },
        });
    }
    async clientViewed(actor, client) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.CLIENT,
            action: enums_1.ActivityAction.VIEW,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'Clients',
            title: 'Client Viewed',
            description: `${actor.name} viewed client ${client.name}`,
            referenceId: client.id,
            referenceType: 'CLIENT',
        });
    }
    async clientUpdated(actor, client, oldValues, newValues) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.CLIENT,
            action: enums_1.ActivityAction.UPDATE,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'Clients',
            title: 'Client Updated',
            description: `${actor.name} updated client ${client.name}`,
            referenceId: client.id,
            referenceType: 'CLIENT',
            oldValues,
            newValues,
        });
    }
    async clientDeleted(actor, client) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.CLIENT,
            action: enums_1.ActivityAction.DELETE,
            severity: enums_1.ActivitySeverity.WARNING,
            moduleName: 'Clients',
            title: 'Client Deleted',
            description: `${actor.name} deleted client ${client.name}`,
            referenceId: client.id,
            referenceType: 'CLIENT',
            metadata: {
                deletedClientName: client.name,
            },
        });
    }
    async duplicateEmailAttempt(actor, email) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.CLIENT,
            action: enums_1.ActivityAction.CREATE,
            severity: enums_1.ActivitySeverity.WARNING,
            moduleName: 'Clients',
            title: 'Duplicate Client Email',
            description: `Attempted to create client with existing email ${email}`,
            metadata: {
                email,
            },
        });
    }
};
exports.ClientEngagementService = ClientEngagementService;
exports.ClientEngagementService = ClientEngagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [engagement_service_1.EngagementService])
], ClientEngagementService);
//# sourceMappingURL=client-engagement.service.js.map