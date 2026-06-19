// modules/engagement/services/cdn-engagement.service.ts

import { Injectable } from '@nestjs/common';

import { EngagementService } from '../engagement.service';

import { ActivityAction, ActivitySeverity, ContextTag } from '@/common/enums';

@Injectable()
export class CdnEngagementService {
  constructor(private readonly engagementService: EngagementService) {}

  async fileUploaded(
    actor: {
      id: string;
      name: string;
    },
    file: {
      filename: string;
      url: string;
      originalName?: string;
      size?: number;
      mimeType?: string;
    },
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.CDN,

      action: ActivityAction.CREATE,

      severity: ActivitySeverity.INFO,

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

  async fileViewed(
    actor: {
      id: string;
      name: string;
    },
    file: {
      filename: string;
      url?: string;
    },
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.CDN,

      action: ActivityAction.VIEW,

      severity: ActivitySeverity.INFO,

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

  async fileUpdated(
    actor: {
      id: string;
      name: string;
    },
    file: {
      filename: string;
    },
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.CDN,

      action: ActivityAction.UPDATE,

      severity: ActivitySeverity.INFO,

      moduleName: 'CDN',

      title: 'File Updated',

      description: `${actor.name} updated file ${file.filename}`,

      referenceId: file.filename,

      referenceType: 'CDN_FILE',

      oldValues,

      newValues,
    });
  }

  async fileDeleted(
    actor: {
      id: string;
      name: string;
    },
    file: {
      filename: string;
      url?: string;
    },
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.CDN,

      action: ActivityAction.DELETE,

      severity: ActivitySeverity.WARNING,

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

  async uploadFailed(
    actor: {
      id: string;
      name: string;
    },
    filename: string,
    error: string,
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.CDN,

      action: ActivityAction.CREATE,

      severity: ActivitySeverity.ERROR,

      moduleName: 'CDN',

      title: 'File Upload Failed',

      description: `${actor.name} failed to upload file ${filename}`,

      metadata: {
        filename,
        error,
      },
    });
  }
}
