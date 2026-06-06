"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
let AppService = class AppService {
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
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map