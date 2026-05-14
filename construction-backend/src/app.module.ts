import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

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

// Database Config
import databaseConfig from './config/database.config';

@Module({
  imports: [
    // Global Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    // Sequelize Database Connection
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),

    // Feature Modules
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
})
export class AppModule {}
