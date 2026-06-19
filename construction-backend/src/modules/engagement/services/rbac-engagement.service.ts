// modules/engagement/services/rbac-engagement.service.ts

import { Injectable } from '@nestjs/common';

import { EngagementService } from '../engagement.service';

import { ActivityAction, ActivitySeverity, ContextTag } from '@/common/enums';

@Injectable()
export class RbacEngagementService {
  constructor(private readonly engagementService: EngagementService) {}

  async roleCreated(
    actor: {
      id: string;
      name: string;
    },
    role: {
      id: string;
      name: string;
    },
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.RBAC,

      action: ActivityAction.CREATE,

      severity: ActivitySeverity.INFO,

      moduleName: 'RBAC',

      title: 'Role Created',

      description: `${actor.name} created role ${role.name}`,

      referenceId: role.id,

      referenceType: 'ROLE',

      metadata: {
        roleName: role.name,
      },
    });
  }

  async permissionCreated(
    actor: {
      id: string;
      name: string;
    },
    permission: {
      id: string;
      name: string;
      module?: string;
      action?: string;
    },
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.RBAC,

      action: ActivityAction.CREATE,

      severity: ActivitySeverity.INFO,

      moduleName: 'RBAC',

      title: 'Permission Created',

      description: `${actor.name} created permission ${permission.name}`,

      referenceId: permission.id,

      referenceType: 'PERMISSION',

      metadata: {
        permissionName: permission.name,
        module: permission.module,
        action: permission.action,
      },
    });
  }

  async permissionsAssigned(
    actor: {
      id: string;
      name: string;
    },
    role: {
      id: string;
      name: string;
    },
    permissionIds: string[],
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.RBAC,

      action: ActivityAction.UPDATE,

      severity: ActivitySeverity.INFO,

      moduleName: 'RBAC',

      title: 'Permissions Assigned',

      description: `${actor.name} assigned permissions to role ${role.name}`,

      referenceId: role.id,

      referenceType: 'ROLE',

      metadata: {
        roleName: role.name,
        permissionCount: permissionIds.length,
      },
    });
  }
}
