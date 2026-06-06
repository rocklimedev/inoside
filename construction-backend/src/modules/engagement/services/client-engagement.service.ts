// modules/engagement/services/client-engagement.service.ts

import { Injectable } from '@nestjs/common';

import { EngagementService } from '../engagement.service';

import { ActivityAction, ActivitySeverity, ContextTag } from '@/common/enums';

@Injectable()
export class ClientEngagementService {
  constructor(private readonly engagementService: EngagementService) {}

  async clientCreated(
    actor: {
      id: string;
      name: string;
    },
    client: {
      id: string;
      name: string;
      email?: string;
      company_name?: string;
    },
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.CLIENT,

      action: ActivityAction.CREATE,

      severity: ActivitySeverity.INFO,

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

  async clientViewed(
    actor: {
      id: string;
      name: string;
    },
    client: {
      id: string;
      name: string;
    },
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.CLIENT,

      action: ActivityAction.VIEW,

      severity: ActivitySeverity.INFO,

      moduleName: 'Clients',

      title: 'Client Viewed',

      description: `${actor.name} viewed client ${client.name}`,

      referenceId: client.id,

      referenceType: 'CLIENT',
    });
  }

  async clientUpdated(
    actor: {
      id: string;
      name: string;
    },
    client: {
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

      contextTag: ContextTag.CLIENT,

      action: ActivityAction.UPDATE,

      severity: ActivitySeverity.INFO,

      moduleName: 'Clients',

      title: 'Client Updated',

      description: `${actor.name} updated client ${client.name}`,

      referenceId: client.id,

      referenceType: 'CLIENT',

      oldValues,

      newValues,
    });
  }

  async clientDeleted(
    actor: {
      id: string;
      name: string;
    },
    client: {
      id: string;
      name: string;
    },
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.CLIENT,

      action: ActivityAction.DELETE,

      severity: ActivitySeverity.WARNING,

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

  async duplicateEmailAttempt(
    actor: {
      id: string;
      name: string;
    },
    email: string,
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.CLIENT,

      action: ActivityAction.CREATE,

      severity: ActivitySeverity.WARNING,

      moduleName: 'Clients',

      title: 'Duplicate Client Email',

      description: `Attempted to create client with existing email ${email}`,

      metadata: {
        email,
      },
    });
  }
}
