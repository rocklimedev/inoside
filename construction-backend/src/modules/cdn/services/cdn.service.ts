import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

import SftpClient from 'ssh2-sftp-client';

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

      const filename =
        Date.now() + '-' + file.originalname.replace(/\s+/g, '-');

      const remotePath = `${process.env.CDN_UPLOAD_PATH}/${filename}`;

      await sftp.put(file.buffer, remotePath);

      const url = `${process.env.CDN_BASE_URL}/${filename}`;

      return {
        filename,
        url,
      };
    } finally {
      await sftp.end();
    }
  }
}
