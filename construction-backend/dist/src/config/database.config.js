"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const databaseConfig = (configService) => ({
    dialect: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    autoLoadModels: true,
    synchronize: configService.get('NODE_ENV') === 'development',
    logging: configService.get('NODE_ENV') === 'development'
        ? console.log
        : false,
    pool: {
        max: 50,
        min: 8,
        acquire: 60000,
        idle: 30000,
        evict: 10000,
    },
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        timestamps: true,
        underscored: false,
    },
    timezone: '+05:30',
    retry: {
        match: [
            /SequelizeConnectionError/,
            /SequelizeConnectionRefusedError/,
            /SequelizeHostNotFoundError/,
            /SequelizeHostNotReachableError/,
            /SequelizeInvalidConnectionError/,
            /SequelizeConnectionTimedOutError/,
        ],
        max: 3,
    },
});
exports.databaseConfig = databaseConfig;
exports.default = exports.databaseConfig;
//# sourceMappingURL=database.config.js.map