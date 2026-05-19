import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { APP_GUARD } from '@nestjs/core';

import { SequelizeModule } from '@nestjs/sequelize';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

// CORE
import { AppController } from './app.controller';
import { AppService } from './app.service';

// CONFIG
import databaseConfig from './config/database.config';

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
    // DATABASE
    // =================================================
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: databaseConfig,
    }),

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
  ],

  controllers: [AppController],

  providers: [
    AppService,

    // =================================================
    // GLOBAL RATE LIMITER
    // =================================================
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
