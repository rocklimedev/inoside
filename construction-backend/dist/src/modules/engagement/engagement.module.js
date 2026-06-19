"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngagementModule = void 0;
const common_1 = require("@nestjs/common");
const activity_log_module_1 = require("../activity-log/activity-log.module");
const notifications_module_1 = require("../notifications/notifications.module");
const engagement_service_1 = require("./engagement.service");
const auth_engagement_service_1 = require("./services/auth-engagement.service");
const client_engagement_service_1 = require("./services/client-engagement.service");
const cdn_engagement_service_1 = require("./services/cdn-engagement.service");
const rbac_engagement_service_1 = require("./services/rbac-engagement.service");
const site_engagement_service_1 = require("./services/site-engagement.service");
const task_engagement_service_1 = require("./services/task-engagement.service");
const user_engagement_service_1 = require("./services/user-engagement.service");
const vendor_engagement_service_1 = require("./services/vendor-engagement.service");
let EngagementModule = class EngagementModule {
};
exports.EngagementModule = EngagementModule;
exports.EngagementModule = EngagementModule = __decorate([
    (0, common_1.Module)({
        imports: [activity_log_module_1.ActivityLogModule, notifications_module_1.NotificationsModule],
        providers: [
            engagement_service_1.EngagementService,
            auth_engagement_service_1.AuthEngagementService,
            client_engagement_service_1.ClientEngagementService,
            cdn_engagement_service_1.CdnEngagementService,
            rbac_engagement_service_1.RbacEngagementService,
            site_engagement_service_1.SiteEngagementService,
            task_engagement_service_1.TaskEngagementService,
            user_engagement_service_1.UserEngagementService,
            vendor_engagement_service_1.VendorEngagementService,
        ],
        exports: [
            engagement_service_1.EngagementService,
            auth_engagement_service_1.AuthEngagementService,
            client_engagement_service_1.ClientEngagementService,
            cdn_engagement_service_1.CdnEngagementService,
            site_engagement_service_1.SiteEngagementService,
            task_engagement_service_1.TaskEngagementService,
            user_engagement_service_1.UserEngagementService,
            vendor_engagement_service_1.VendorEngagementService,
            rbac_engagement_service_1.RbacEngagementService,
        ],
    })
], EngagementModule);
//# sourceMappingURL=engagement.module.js.map