"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MetricsInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let MetricsInterceptor = class MetricsInterceptor {
    static { MetricsInterceptor_1 = this; }
    static requests = 0;
    static totalResponseTime = 0;
    intercept(context, next) {
        const start = Date.now();
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = Date.now() - start;
            MetricsInterceptor_1.requests++;
            MetricsInterceptor_1.totalResponseTime += duration;
        }));
    }
};
exports.MetricsInterceptor = MetricsInterceptor;
exports.MetricsInterceptor = MetricsInterceptor = MetricsInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], MetricsInterceptor);
//# sourceMappingURL=metrics.enterceptor.js.map