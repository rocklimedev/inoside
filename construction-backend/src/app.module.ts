import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

// =================================================
// MONGOOSE
// =================================================
import { MongooseModule } from '@nestjs/mongoose';

// CORE
import { AppController } from './app.controller';
import { AppService } from './app.service';

// CONFIG
import databaseConfig from './config/database.config';
import { MongodbConfig } from './config/mongo.config';
// MODULES
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { BoqModule } from './modules/boq/boq.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { ClientsModule } from './modules/clients/client.module';
import { SitesModule } from './modules/sites/sites.module';
import { CdnModule } from './modules/cdn/cdn.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    // =================================================
    // ENV CONFIG
    // =================================================
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),

    // =================================================
    // RATE LIMITING
    // =================================================
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100,
      },
    ]),

    // =================================================
    // MYSQL (SEQUELIZE)
    // =================================================
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),

    // =================================================
    // MONGODB (MONGOOSE) ✅ ADD THIS
    // =================================================
    MongodbConfig,

    // =================================================
    // FEATURE MODULES
    // =================================================
    AuthModule,
    UsersModule,
    RbacModule,
    ProjectsModule,
    InventoryModule,
    BoqModule,
    VendorsModule,
    ClientsModule,
    SitesModule,
    CdnModule,
    NotificationsModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
