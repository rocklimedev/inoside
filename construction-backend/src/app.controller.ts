import { Controller, Get, HttpStatus, Redirect } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('System')
@Controller()
export class AppController {
  // =================================================
  // ROOT
  // =================================================

  @Get()
  @ApiOperation({
    summary: 'Application Overview',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Application information',
  })
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

  // =================================================
  // HEALTH CHECK
  // =================================================

  @Get('health')
  @ApiOperation({
    summary: 'Detailed Health Check',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Server health information',
  })
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

  // =================================================
  // LIGHTWEIGHT PING
  // =================================================

  @Get('ping')
  @ApiOperation({
    summary: 'Fast Ping Endpoint',
  })
  ping() {
    return {
      success: true,
      message: 'pong',
      timestamp: Date.now(),
    };
  }

  // =================================================
  // VERSION
  // =================================================

  @Get('version')
  @ApiOperation({
    summary: 'Application Version',
  })
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

  // =================================================
  // CDN STATUS
  // =================================================

  @Get('cdn-status')
  @ApiOperation({
    summary: 'CDN Service Status',
  })
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

  // =================================================
  // SWAGGER REDIRECT
  // =================================================

  @Get('docs')
  @ApiOperation({
    summary: 'Redirect To Swagger Docs',
  })
  @Redirect('/api-docs', 301)
  getDocs() {}

  // =================================================
  // READY CHECK
  // =================================================

  @Get('ready')
  @ApiOperation({
    summary: 'Container Ready Check',
  })
  readinessCheck() {
    return {
      success: true,
      ready: true,
      timestamp: new Date().toISOString(),
    };
  }

  // =================================================
  // LIVE CHECK
  // =================================================

  @Get('live')
  @ApiOperation({
    summary: 'Container Liveness Check',
  })
  livenessCheck() {
    return {
      success: true,
      live: true,
    };
  }
}
