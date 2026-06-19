import { Injectable } from '@nestjs/common';

import { EngagementService } from '../engagement.service';

import { ActivityAction, ActivitySeverity, ContextTag } from '@/common/enums';

@Injectable()
export class VendorEngagementService {
  constructor(private readonly engagementService: EngagementService) {}

  async vendorCreated(
    actor: { id: string; name: string },
    vendor: { id: string; name: string },
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.VENDOR,

      action: ActivityAction.CREATE,

      severity: ActivitySeverity.INFO,

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

  async vendorUpdated(
    actor: { id: string; name: string },
    vendor: { id: string; name: string },
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.VENDOR,

      action: ActivityAction.UPDATE,

      severity: ActivitySeverity.INFO,

      moduleName: 'Vendors',

      title: 'Vendor Updated',

      description: `${actor.name} updated vendor ${vendor.name}`,

      referenceId: vendor.id,

      referenceType: 'VENDOR',

      oldValues,

      newValues,
    });
  }

  async vendorDeleted(
    actor: { id: string; name: string },
    vendor: { id: string; name: string },
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.VENDOR,

      action: ActivityAction.DELETE,

      severity: ActivitySeverity.WARNING,

      moduleName: 'Vendors',

      title: 'Vendor Deleted',

      description: `${actor.name} deleted vendor ${vendor.name}`,

      referenceId: vendor.id,

      referenceType: 'VENDOR',
    });
  }

  async vendorAssignedToProject(
    actor: { id: string; name: string },
    projectId: string,
    vendorId: string,
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.VENDOR,

      action: ActivityAction.CREATE,

      severity: ActivitySeverity.INFO,

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

  async vendorRemovedFromProject(
    actor: { id: string; name: string },
    projectId: string,
    vendorId: string,
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.VENDOR,

      action: ActivityAction.DELETE,

      severity: ActivitySeverity.WARNING,

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
}
