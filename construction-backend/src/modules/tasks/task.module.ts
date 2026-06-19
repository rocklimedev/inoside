import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Task } from './models/task.model';
import { Project } from '@/modules/projects/models/project.model';
import { User } from '@/modules/users/models/user.model';

import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { EngagementModule } from '../engagement/engagement.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Task, Project, User]),
    EngagementModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
