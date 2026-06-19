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
exports.VendorEngagementService = void 0;
const common_1 = require("@nestjs/common");
const engagement_service_1 = require("../engagement.service");
const enums_1 = require("../../../common/enums");
let VendorEngagementService = class VendorEngagementService {
    engagementService;
    constructor(engagementService) {
        this.engagementService = engagementService;
    }
    async vendorCreated(actor, vendor) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.VENDOR,
            action: enums_1.ActivityAction.CREATE,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'Vendors',
            title: 'Vendor Created',
            description: `${actor.name} created vendor ${vendor.name}`,
            referenceId: vendor.id,
            referenceType: 'VENDOR',
            metadata: {
                vendorName: vendor.name,
            },
        });
    }
    async vendorUpdated(actor, vendor, oldValues, newValues) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.VENDOR,
            action: enums_1.ActivityAction.UPDATE,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'Vendors',
            title: 'Vendor Updated',
            description: `${actor.name} updated vendor ${vendor.name}`,
            referenceId: vendor.id,
            referenceType: 'VENDOR',
            oldValues,
            newValues,
        });
    }
    async vendorDeleted(actor, vendor) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.VENDOR,
            action: enums_1.ActivityAction.DELETE,
            severity: enums_1.ActivitySeverity.WARNING,
            moduleName: 'Vendors',
            title: 'Vendor Deleted',
            description: `${actor.name} deleted vendor ${vendor.name}`,
            referenceId: vendor.id,
            referenceType: 'VENDOR',
        });
    }
    async vendorAssignedToProject(actor, projectId, vendorId) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.VENDOR,
            action: enums_1.ActivityAction.CREATE,
            severity: enums_1.ActivitySeverity.INFO,
            moduleName: 'Vendors',
            title: 'Vendor Assigned',
            description: `${actor.name} assigned vendor to project`,
            referenceId: vendorId,
            referenceType: 'VENDOR',
            metadata: {
                projectId,
            },
        });
    }
    async vendorRemovedFromProject(actor, projectId, vendorId) {
        return this.engagementService.audit({
            actor: {
                userId: actor.id,
                userName: actor.name,
            },
            contextTag: enums_1.ContextTag.VENDOR,
            action: enums_1.ActivityAction.DELETE,
            severity: enums_1.ActivitySeverity.WARNING,
            moduleName: 'Vendors',
            title: 'Vendor Removed',
            description: `${actor.name} removed vendor from project`,
            referenceId: vendorId,
            referenceType: 'VENDOR',
            metadata: {
                projectId,
            },
        });
    }
};
exports.VendorEngagementService = VendorEngagementService;
exports.VendorEngagementService = VendorEngagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [engagement_service_1.EngagementService])
], VendorEngagementService);
//# sourceMappingURL=vendor-engagement.service.js.map