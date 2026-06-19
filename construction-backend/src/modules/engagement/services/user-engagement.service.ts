// modules/engagement/services/user-engagement.service.ts

import { Injectable } from '@nestjs/common';

import { EngagementService } from '../engagement.service';

import { ActivityAction, ActivitySeverity, ContextTag } from '@/common/enums';

@Injectable()
export class UserEngagementService {
  constructor(private readonly engagementService: EngagementService) {}

  async userCreated(
    actor: {
      id: string;
      name: string;
    },
    user: {
      id: string;
      name: string;
      email: string;
    },
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.USER,

      action: ActivityAction.CREATE,

      severity: ActivitySeverity.INFO,

      moduleName: 'Users',

      title: 'User Created',

      description: `${actor.name} created user ${user.name}`,

      referenceId: user.id,

      referenceType: 'USER',

      metadata: {
        name: user.name,
        email: user.email,
      },
    });
  }

  async userUpdated(
    actor: {
      id: string;
      name: string;
    },
    user: {
      id: string;
      name: string;
    },
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.USER,

      action: ActivityAction.UPDATE,

      severity: ActivitySeverity.INFO,

      moduleName: 'Users',

      title: 'User Updated',

      description: `${actor.name} updated user ${user.name}`,

      referenceId: user.id,

      referenceType: 'USER',

      oldValues,

      newValues,
    });
  }

  async userDeleted(
    actor: {
      id: string;
      name: string;
    },
    user: {
      id: string;
      name: string;
    },
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.USER,

      action: ActivityAction.DELETE,

      severity: ActivitySeverity.WARNING,

      moduleName: 'Users',

      title: 'User Deleted',

      description: `${actor.name} deleted user ${user.name}`,

      referenceId: user.id,

      referenceType: 'USER',

      metadata: {
        name: user.name,
      },
    });
  }

  async userStatusChanged(
    actor: {
      id: string;
      name: string;
    },
    user: {
      id: string;
      name: string;
      isActive: boolean;
    },
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.USER,

      action: ActivityAction.UPDATE,

      severity: ActivitySeverity.INFO,

      moduleName: 'Users',

      title: user.isActive ? 'User Activated' : 'User Deactivated',

      description: `${actor.name} ${user.isActive ? 'activated' : 'deactivated'} user ${user.name}`,

      referenceId: user.id,

      referenceType: 'USER',

      metadata: {
        isActive: user.isActive,
      },
    });
  }
}
