import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('GET /', () => {
    it('should return welcome message with application info', () => {
      const result = appController.getHello();

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('status', 'running');
      expect(result).toHaveProperty('timestamp');
      expect(result.message).toContain('Construction Project Management API');
    });
  });

  describe('GET /health', () => {
    it('should return healthy status', () => {
      const result = appController.healthCheck();

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('status', 'healthy');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('timestamp');
    });
  });

  describe('GET /docs', () => {
    it('should be properly defined', () => {
      expect(appController.getDocs).toBeDefined();
    });
  });

  describe('root', () => {
    it('should return success response', () => {
      const result = appController.getHello();
      expect(result.success).toBe(true);
    });
  });
});
