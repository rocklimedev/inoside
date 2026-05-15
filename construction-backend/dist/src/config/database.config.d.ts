import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
export declare const databaseConfig: (configService: ConfigService) => SequelizeModuleOptions;
export default databaseConfig;
