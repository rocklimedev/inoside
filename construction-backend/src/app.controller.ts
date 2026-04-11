import { Controller, Get, HttpStatus, Redirect } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Application Health Check' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Application is running successfully',
  })
  getHello() {
    return {
      success: true,
      message: 'Welcome to Construction Project Management API',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health Check Endpoint' })
  healthCheck() {
    return {
      success: true,
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: 'connected', // You can enhance this with actual DB check later
    };
  }

  @Get('docs')
  @ApiOperation({ summary: 'Redirect to Swagger Documentation' })
  @Redirect('/api-docs', 301)
  getDocs() {}
}
