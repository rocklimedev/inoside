import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { BoqModule } from './modules/boq/boq.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { ClientsModule } from './modules/clients/client.module';
import { SitesModule } from './modules/sites/sites.module';

import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    // RATE LIMITING
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100,
      },
    ]),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),

    AuthModule,
    UsersModule,
    RbacModule,
    ProjectsModule,
    BoqModule,
    ClientsModule,
    SitesModule,
    VendorsModule,
    InventoryModule,
  ],

  // 🔥 GLOBAL GUARD (THIS ENABLES RATE LIMITING)
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
