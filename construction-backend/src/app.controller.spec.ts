import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  // =================================================
  // ROOT
  // =================================================

  describe('GET /', () => {
    it('should return application overview', () => {
      const result = controller.getRoot();

      expect(result).toBeDefined();

      expect(result.success).toBe(true);

      expect(result).toHaveProperty('application');

      expect(result).toHaveProperty('server');

      expect(result).toHaveProperty('services');

      expect(result).toHaveProperty('urls');

      expect(result.application.name).toContain('Buildcon');
    });
  });

  // =================================================
  // HEALTH
  // =================================================

  describe('GET /health', () => {
    it('should return health status', () => {
      const result = controller.healthCheck();

      expect(result.success).toBe(true);

      expect(result.health.status).toBe('healthy');

      expect(result).toHaveProperty('memory');

      expect(result).toHaveProperty('process');

      expect(result).toHaveProperty('database');
    });
  });

  // =================================================
  // PING
  // =================================================

  describe('GET /ping', () => {
    it('should return pong response', () => {
      const result = controller.ping();

      expect(result.success).toBe(true);

      expect(result.message).toBe('pong');

      expect(result).toHaveProperty('timestamp');
    });
  });

  // =================================================
  // VERSION
  // =================================================

  describe('GET /version', () => {
    it('should return version details', () => {
      const result = controller.version();

      expect(result.success).toBe(true);

      expect(result).toHaveProperty('version');

      expect(result.version).toHaveProperty('api');

      expect(result.version).toHaveProperty('node');

      expect(result.version).toHaveProperty('environment');
    });
  });

  // =================================================
  // CDN STATUS
  // =================================================

  describe('GET /cdn-status', () => {
    it('should return CDN information', () => {
      const result = controller.cdnStatus();

      expect(result.success).toBe(true);

      expect(result.cdn.enabled).toBe(true);

      expect(result.cdn).toHaveProperty('provider');

      expect(result.cdn).toHaveProperty('domain');

      expect(result.cdn).toHaveProperty('upload_api');
    });
  });

  // =================================================
  // READY
  // =================================================

  describe('GET /ready', () => {
    it('should return readiness state', () => {
      const result = controller.readinessCheck();

      expect(result.success).toBe(true);

      expect(result.ready).toBe(true);
    });
  });

  // =================================================
  // LIVE
  // =================================================

  describe('GET /live', () => {
    it('should return liveness state', () => {
      const result = controller.livenessCheck();

      expect(result.success).toBe(true);

      expect(result.live).toBe(true);
    });
  });

  // =================================================
  // DOCS
  // =================================================

  describe('GET /docs', () => {
    it('should be defined', () => {
      expect(controller.getDocs).toBeDefined();
    });
  });
});
