"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongodbConfig = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
exports.MongodbConfig = mongoose_1.MongooseModule.forRootAsync({
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: (configService) => ({
        uri: configService.get('MONGO_URI'),
        dbName: configService.get('MONGO_DB_NAME'),
        retryAttempts: 3,
        retryDelay: 3000,
        connectionFactory: (connection) => {
            connection.on('connected', () => {
                console.log('✅ MongoDB connected');
            });
            connection.on('error', (err) => {
                console.error('❌ MongoDB error:', err);
            });
            return connection;
        },
    }),
});
//# sourceMappingURL=mongo.config.js.map