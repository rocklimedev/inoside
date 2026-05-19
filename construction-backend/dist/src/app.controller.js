"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let AppController = class AppController {
    getRoot() {
        return {
            success: true,
            application: {
                name: 'Buildcon Construction API',
                version: '1.0.0',
                environment: process.env.NODE_ENV || 'development',
            },
            server: {
                status: 'running',
                uptime_seconds: process.uptime(),
                timestamp: new Date().toISOString(),
            },
            services: {
                auth: true,
                projects: true,
                inventory: true,
                boq: true,
                vendors: true,
                clients: true,
                sites: true,
                cdn: true,
            },
            urls: {
                api_docs: '/api-docs',
                health: '/health',
                ping: '/ping',
            },
        };
    }
    healthCheck() {
        return {
            success: true,
            health: {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime_seconds: process.uptime(),
            },
            memory: {
                rss: process.memoryUsage().rss,
                heap_total: process.memoryUsage().heapTotal,
                heap_used: process.memoryUsage().heapUsed,
                external: process.memoryUsage().external,
            },
            process: {
                pid: process.pid,
                platform: process.platform,
                node_version: process.version,
            },
            database: {
                status: 'connected',
                engine: 'mysql',
                orm: 'sequelize',
            },
        };
    }
    ping() {
        return {
            success: true,
            message: 'pong',
            timestamp: Date.now(),
        };
    }
    version() {
        return {
            success: true,
            version: {
                api: '1.0.0',
                node: process.version,
                environment: process.env.NODE_ENV || 'development',
            },
        };
    }
    cdnStatus() {
        return {
            success: true,
            cdn: {
                enabled: true,
                provider: 'Self Hosted NGINX CDN',
                domain: 'https://media-buildcon.rippotaiarchitecture.com',
                upload_api: 'https://buildcon-api.rippotaiarchitecture.com/api/cdn/upload',
                storage: {
                    type: 'local',
                    path: '/opt/media-buildcon/uploads',
                },
            },
        };
    }
    getDocs() { }
    readinessCheck() {
        return {
            success: true,
            ready: true,
            timestamp: new Date().toISOString(),
        };
    }
    livenessCheck() {
        return {
            success: true,
            live: true,
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Application Overview',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Application information',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getRoot", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({
        summary: 'Detailed Health Check',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Server health information',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Get)('ping'),
    (0, swagger_1.ApiOperation)({
        summary: 'Fast Ping Endpoint',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "ping", null);
__decorate([
    (0, common_1.Get)('version'),
    (0, swagger_1.ApiOperation)({
        summary: 'Application Version',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "version", null);
__decorate([
    (0, common_1.Get)('cdn-status'),
    (0, swagger_1.ApiOperation)({
        summary: 'CDN Service Status',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "cdnStatus", null);
__decorate([
    (0, common_1.Get)('docs'),
    (0, swagger_1.ApiOperation)({
        summary: 'Redirect To Swagger Docs',
    }),
    (0, common_1.Redirect)('/api-docs', 301),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getDocs", null);
__decorate([
    (0, common_1.Get)('ready'),
    (0, swagger_1.ApiOperation)({
        summary: 'Container Ready Check',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "readinessCheck", null);
__decorate([
    (0, common_1.Get)('live'),
    (0, swagger_1.ApiOperation)({
        summary: 'Container Liveness Check',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "livenessCheck", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('System'),
    (0, common_1.Controller)()
], AppController);
//# sourceMappingURL=app.controller.js.map