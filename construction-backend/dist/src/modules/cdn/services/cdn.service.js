"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdnService = void 0;
const common_1 = require("@nestjs/common");
const ssh2_sftp_client_1 = __importDefault(require("ssh2-sftp-client"));
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
let CdnService = class CdnService {
    async uploadFile(file) {
        const sftp = new ssh2_sftp_client_1.default();
        try {
            console.log('==========================');
            console.log({
                user: process.env.CDN_USERNAME,
                pass: process.env.CDN_PASSWORD,
            });
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
            const ext = path.extname(file.originalname);
            const filename = `${(0, uuid_1.v4)()}${ext}`;
            const remotePath = `${process.env.CDN_UPLOAD_PATH}/${filename}`;
            console.log('Remote Path:', remotePath);
            await sftp.put(file.buffer, remotePath);
            console.log('Upload Success');
            const url = `${process.env.CDN_BASE_URL}/${filename}`;
            return {
                filename,
                url,
            };
        }
        catch (err) {
            console.error('==========================');
            console.error('CDN UPLOAD ERROR');
            console.error(err);
            throw err;
        }
        finally {
            await sftp.end().catch(() => { });
        }
    }
};
exports.CdnService = CdnService;
exports.CdnService = CdnService = __decorate([
    (0, common_1.Injectable)()
], CdnService);
//# sourceMappingURL=cdn.service.js.map