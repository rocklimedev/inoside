import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  dialect: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),

  // Auto-load all models (recommended)
  autoLoadModels: true,

  // IMPORTANT: Set to FALSE in Production
  synchronize: configService.get<string>('NODE_ENV') === 'development',

  // Logging
  logging:
    configService.get<string>('NODE_ENV') === 'development'
      ? console.log
      : false,

  // Pool Configuration (Performance)
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },

  // Charset & Collation
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    timestamps: true,
    underscored: false, // Use camelCase (matches your models)
  },

  // Timezone
  timezone: '+05:30', // Change according to your timezone (e.g. '+00:00' for UTC)
});

export default databaseConfig;
