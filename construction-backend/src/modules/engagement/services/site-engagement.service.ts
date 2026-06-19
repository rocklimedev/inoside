import { Injectable } from '@nestjs/common';

import { EngagementService } from '../engagement.service';

import { ActivityAction, ActivitySeverity, ContextTag } from '@/common/enums';

@Injectable()
export class SiteEngagementService {
  constructor(private readonly engagementService: EngagementService) {}

  async siteCreated(
    actor: {
      id: string;
      name: string;
    },
    site: {
      id: string;
      clientId?: string;
    },
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.SITE,

      action: ActivityAction.CREATE,

      severity: ActivitySeverity.INFO,

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

  async siteUpdated(
    actor: {
      id: string;
      name: string;
    },
    site: {
      id: string;
      clientId?: string;
    },
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.SITE,

      action: ActivityAction.UPDATE,

      severity: ActivitySeverity.INFO,

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

  async siteDeleted(
    actor: {
      id: string;
      name: string;
    },
    site: {
      id: string;
      clientId?: string;
    },
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.SITE,

      action: ActivityAction.DELETE,

      severity: ActivitySeverity.WARNING,

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
}
