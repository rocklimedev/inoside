"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdnGuard = void 0;
const common_1 = require("@nestjs/common");
let CdnGuard = class CdnGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.headers['x-cdn-secret'];
        if (!token) {
            throw new common_1.UnauthorizedException('Missing CDN token');
        }
        if (token !== process.env.CDN_INTERNAL_SECRET) {
            throw new common_1.UnauthorizedException('Invalid CDN token');
        }
        return true;
    }
};
exports.CdnGuard = CdnGuard;
exports.CdnGuard = CdnGuard = __decorate([
    (0, common_1.Injectable)()
], CdnGuard);
//# sourceMappingURL=cdn.guard.js.map