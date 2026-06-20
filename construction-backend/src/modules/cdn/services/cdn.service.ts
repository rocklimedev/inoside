import { Injectable } from '@nestjs/common';
import SftpClient from 'ssh2-sftp-client';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class CdnService {
  async uploadFile(file: Express.Multer.File) {
    const sftp = new SftpClient();

    try {
      await sftp.connect({
        host: process.env.CDN_HOST,
        port: Number(process.env.CDN_PORT),
        username: process.env.CDN_USERNAME,
        password: process.env.CDN_PASSWORD,
      });

      console.log('SFTP Connected');

      // Keep original extension
      const ext = path.extname(file.originalname);

      // UUID only
      const filename = `${uuidv4()}${ext}`;

      // OR UUID + timestamp
      // const filename = `${Date.now()}-${uuidv4()}${ext}`;

      const remotePath = `${process.env.CDN_UPLOAD_PATH}/${filename}`;

      await sftp.put(file.buffer, remotePath);

      const url = `${process.env.CDN_BASE_URL}/${filename}`;

      return {
        filename,
        url,
      };
    } catch (err) {
      throw err;
    } finally {
      await sftp.end().catch(() => {});
    }
  }
}
