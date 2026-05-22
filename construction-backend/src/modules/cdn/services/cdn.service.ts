import { Injectable } from '@nestjs/common';
import SftpClient from 'ssh2-sftp-client';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class CdnService {
  async uploadFile(file: Express.Multer.File) {
    const sftp = new SftpClient();

    try {
      console.log('==========================');
      console.log('CDN Upload Started');
      console.log('Host:', process.env.CDN_HOST);
      console.log('Port:', process.env.CDN_PORT);
      console.log('Upload Path:', process.env.CDN_UPLOAD_PATH);
      console.log('Original Filename:', file.originalname);

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

      console.log('Remote Path:', remotePath);

      await sftp.put(file.buffer, remotePath);

      console.log('Upload Success');

      const url = `${process.env.CDN_BASE_URL}/${filename}`;

      return {
        filename,
        url,
      };
    } catch (err) {
      console.error('==========================');
      console.error('CDN UPLOAD ERROR');
      console.error(err);

      throw err;
    } finally {
      await sftp.end().catch(() => {});
    }
  }
}
