import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RbacModule } from './rbac/rbac.module';
import { ProjectsModule } from './projects/projects.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { BoqModule } from './boq/boq.module'; // ← Added
import { VendorsModule } from './vendors/vendors.module';
import { ProjectProgressModule } from './project-progress/project-progress.module';
import { ClientsModule } from './clients/client.module';
import { SitesModule } from './sites/sites.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: { rejectUnauthorized: false },
    }),

    AuthModule,
    UsersModule,
    RbacModule,
    ProjectsModule,
    AttachmentsModule,
    BoqModule, // ← Added here
    VendorsModule,
    ProjectProgressModule,
    ClientsModule,
    SitesModule,
  ],
})
export class AppModule {}
