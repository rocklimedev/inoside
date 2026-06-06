// modules/engagement/services/auth-engagement.service.ts

import { Injectable } from '@nestjs/common';

import { EngagementService } from '../engagement.service';

import { ActivityAction, ActivitySeverity, ContextTag } from '@/common/enums';

@Injectable()
export class AuthEngagementService {
  constructor(private readonly engagementService: EngagementService) {}

  async userRegistered(user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  }) {
    return this.engagementService.audit({
      actor: {
        userId: user.id,
        userName: user.name,
      },

      contextTag: ContextTag.AUTH,

      action: ActivityAction.CREATE,

      severity: ActivitySeverity.INFO,

      moduleName: 'Auth',

      title: 'User Registered',

      description: `${user.name} registered successfully`,

      referenceId: user.id,

      referenceType: 'USER',

      metadata: {
        email: user.email,
        role: user.role,
      },
    });
  }

  async loginSuccess(user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  }) {
    return this.engagementService.audit({
      actor: {
        userId: user.id,
        userName: user.name,
      },

      contextTag: ContextTag.AUTH,

      action: ActivityAction.LOGIN,

      severity: ActivitySeverity.INFO,

      moduleName: 'Auth',

      title: 'User Logged In',

      description: `${user.name} logged in successfully`,

      referenceId: user.id,

      referenceType: 'USER',

      metadata: {
        email: user.email,
        role: user.role,
      },
    });
  }

  async loginFailed(email: string) {
    return this.engagementService.audit({
      contextTag: ContextTag.AUTH,

      action: ActivityAction.LOGIN,

      severity: ActivitySeverity.WARNING,

      moduleName: 'Auth',

      title: 'Failed Login Attempt',

      description: `Login failed for email ${email}`,

      metadata: {
        email,
      },
    });
  }

  async loginBlocked(user: { id: string; name: string; email: string }) {
    return this.engagementService.audit({
      actor: {
        userId: user.id,
        userName: user.name,
      },

      contextTag: ContextTag.AUTH,

      action: ActivityAction.LOGIN,

      severity: ActivitySeverity.WARNING,

      moduleName: 'Auth',

      title: 'Inactive User Login Attempt',

      description: `${user.name} attempted login while account is inactive`,

      referenceId: user.id,

      referenceType: 'USER',
    });
  }

  async logout(user: { id: string; name: string }) {
    return this.engagementService.audit({
      actor: {
        userId: user.id,
        userName: user.name,
      },

      contextTag: ContextTag.AUTH,

      action: ActivityAction.LOGOUT,

      severity: ActivitySeverity.INFO,

      moduleName: 'Auth',

      title: 'User Logged Out',

      description: `${user.name} logged out`,

      referenceId: user.id,

      referenceType: 'USER',
    });
  }

  async passwordReset(user: { id: string; name: string }) {
    return this.engagementService.audit({
      actor: {
        userId: user.id,
        userName: user.name,
      },

      contextTag: ContextTag.AUTH,

      action: ActivityAction.UPDATE,

      severity: ActivitySeverity.WARNING,

      moduleName: 'Auth',

      title: 'Password Reset',

      description: `${user.name} reset password`,

      referenceId: user.id,

      referenceType: 'USER',
    });
  }
}
