"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdnService = void 0;
const common_1 = require("@nestjs/common");
const ssh2_sftp_client_1 = __importDefault(require("ssh2-sftp-client"));
let CdnService = class CdnService {
    async uploadFile(file) {
        const sftp = new ssh2_sftp_client_1.default();
        try {
            await sftp.connect({
                host: process.env.CDN_HOST,
                port: Number(process.env.CDN_PORT),
                username: process.env.CDN_USERNAME,
                password: process.env.CDN_PASSWORD,
            });
            const filename = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
            const remotePath = `${process.env.CDN_UPLOAD_PATH}/${filename}`;
            await sftp.put(file.buffer, remotePath);
            const url = `${process.env.CDN_BASE_URL}/${filename}`;
            return {
                filename,
                url,
            };
        }
        finally {
            await sftp.end();
        }
    }
};
exports.CdnService = CdnService;
exports.CdnService = CdnService = __decorate([
    (0, common_1.Injectable)()
], CdnService);
//# sourceMappingURL=cdn.service.js.map