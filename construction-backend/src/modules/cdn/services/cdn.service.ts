import { Injectable } from '@nestjs/common';
import SftpClient from 'ssh2-sftp-client';

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
      console.log('Filename:', file.originalname);

      await sftp.connect({
        host: process.env.CDN_HOST,
        port: Number(process.env.CDN_PORT),
        username: process.env.CDN_USERNAME,
        password: process.env.CDN_PASSWORD,
      });

      console.log('SFTP Connected');

      const filename =
        Date.now() +
        '-' +
        file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');

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
