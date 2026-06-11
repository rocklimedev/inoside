"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const metrics_enterceptor_1 = require("./common/enterceptor/metrics.enterceptor");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalInterceptors(new metrics_enterceptor_1.MetricsInterceptor());
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: false,
    }));
    app.use((0, compression_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'https://inoside.vercel.app',
            'https://buildcon.rippotaiarchitecture.com',
            'https://buildcon-api.rippotaiarchitecture.com',
            'https://media-buildcon.rippotaiarchitecture.com',
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-cdn-secret'],
        credentials: true,
        exposedHeaders: ['Set-Cookie'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Buildcon API')
        .setDescription('Construction Project Management API')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    const port = Number(process.env.PORT) || 5000;
    const env = process.env.NODE_ENV || 'development';
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📍 Environment: ${env}`);
    console.log(`📄 Swagger Docs: http://localhost:${port}/api-docs`);
    console.log(`🔒 CORS credentials: enabled`);
    console.log(`🍪 Cookie parser: enabled`);
}
bootstrap();
//# sourceMappingURL=main.js.map