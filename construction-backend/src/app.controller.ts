import { Controller, Get, HttpStatus, Redirect } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Application Overview' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Application information',
  })
  getRoot() {
    return this.appService.getRoot();
  }

  @Get('health')
  @ApiOperation({ summary: 'Detailed Health Check' })
  healthCheck() {
    return this.appService.healthCheck();
  }
  @Get('metrics')
  metrics() {
    return this.appService.metrics();
  }
  @Get('ping')
  @ApiOperation({ summary: 'Fast Ping Endpoint' })
  ping() {
    return this.appService.ping();
  }

  @Get('version')
  @ApiOperation({ summary: 'Application Version' })
  version() {
    return this.appService.version();
  }

  @Get('cdn-status')
  @ApiOperation({ summary: 'CDN Service Status' })
  cdnStatus() {
    return this.appService.cdnStatus();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Container Ready Check' })
  readinessCheck() {
    return this.appService.readinessCheck();
  }

  @Get('live')
  @ApiOperation({ summary: 'Container Liveness Check' })
  livenessCheck() {
    return this.appService.livenessCheck();
  }
}
