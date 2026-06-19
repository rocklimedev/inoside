import { Injectable } from '@nestjs/common';
import SftpClient from 'ssh2-sftp-client';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

import { CdnEngagementService } from '@/modules/engagement/services/cdn-engagement.service';

@Injectable()
export class CdnService {
  constructor(private readonly cdnEngagementService: CdnEngagementService) {}

  async uploadFile(
    file: Express.Multer.File,
    actor?: {
      id: string;
      name: string;
    },
  ) {
    const sftp = new SftpClient();

    try {
      await sftp.connect({
        host: process.env.CDN_HOST,
        port: Number(process.env.CDN_PORT),
        username: process.env.CDN_USERNAME,
        password: process.env.CDN_PASSWORD,
      });

      const ext = path.extname(file.originalname);

      const filename = `${uuidv4()}${ext}`;

      const remotePath = `${process.env.CDN_UPLOAD_PATH}/${filename}`;

      await sftp.put(file.buffer, remotePath);

      const url = `${process.env.CDN_BASE_URL}/${filename}`;

      // Log upload activity
      if (actor) {
        await this.cdnEngagementService.fileUploaded(actor, {
          filename,
          originalName: file.originalname,
          url,
          size: file.size,
          mimeType: file.mimetype,
        });
      }

      return {
        filename,
        url,
      };
    } catch (err) {
      console.error(err);

      // Log failed upload
      if (actor) {
        await this.cdnEngagementService.uploadFailed(
          actor,
          file.originalname,
          err instanceof Error ? err.message : String(err),
        );
      }

      throw err;
    } finally {
      await sftp.end().catch(() => {});
    }
  }
}
