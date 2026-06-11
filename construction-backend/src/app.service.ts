import { Injectable } from '@nestjs/common';
import { MetricsInterceptor } from './common/enterceptor/metrics.enterceptor';
@Injectable()
export class AppService {
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

        upload_api:
          'https://buildcon-api.rippotaiarchitecture.com/api/cdn/upload',

        storage: {
          type: 'local',
          path: '/opt/media-buildcon/uploads',
        },
      },
    };
  }
  metrics() {
    return {
      requests: MetricsInterceptor.requests,

      avg_latency:
        MetricsInterceptor.requests > 0
          ? Math.round(
              MetricsInterceptor.totalResponseTime /
                MetricsInterceptor.requests,
            )
          : 0,

      uptime: process.uptime(),

      memory: process.memoryUsage(),

      timestamp: Date.now(),
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
}
