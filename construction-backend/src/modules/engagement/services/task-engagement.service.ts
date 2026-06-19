// modules/engagement/services/task-engagement.service.ts

import { Injectable } from '@nestjs/common';

import { EngagementService } from '../engagement.service';

import { ActivityAction, ActivitySeverity, ContextTag } from '@/common/enums';

@Injectable()
export class TaskEngagementService {
  constructor(private readonly engagementService: EngagementService) {}

  async taskCreated(
    actor: {
      id: string;
      name: string;
    },
    task: {
      id: string;
      title: string;
      projectId?: string | null;
      assignedToUserId?: string | null;
    },
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.TASK,

      action: ActivityAction.CREATE,

      severity: ActivitySeverity.INFO,

      moduleName: 'Tasks',

      title: 'Task Created',

      description: `${actor.name} created task ${task.title}`,

      referenceId: task.id,

      referenceType: 'TASK',

      metadata: {
        title: task.title,
        projectId: task.projectId,
        assignedToUserId: task.assignedToUserId,
      },
    });
  }

  async taskUpdated(
    actor: {
      id: string;
      name: string;
    },
    task: {
      id: string;
      title: string;
    },
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.TASK,

      action: ActivityAction.UPDATE,

      severity: ActivitySeverity.INFO,

      moduleName: 'Tasks',

      title: 'Task Updated',

      description: `${actor.name} updated task ${task.title}`,

      referenceId: task.id,

      referenceType: 'TASK',

      oldValues,

      newValues,
    });
  }

  async taskDeleted(
    actor: {
      id: string;
      name: string;
    },
    task: {
      id: string;
      title: string;
    },
  ) {
    return this.engagementService.audit({
      actor: {
        userId: actor.id,
        userName: actor.name,
      },

      contextTag: ContextTag.TASK,

      action: ActivityAction.DELETE,

      severity: ActivitySeverity.WARNING,

      moduleName: 'Tasks',

      title: 'Task Deleted',

      description: `${actor.name} deleted task ${task.title}`,

      referenceId: task.id,

      referenceType: 'TASK',

      metadata: {
        title: task.title,
      },
    });
  }
}
