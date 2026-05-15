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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_1 = require("@nestjs/sequelize");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const rbac_module_1 = require("./modules/rbac/rbac.module");
const projects_module_1 = require("./modules/projects/projects.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const boq_module_1 = require("./modules/boq/boq.module");
const vendors_module_1 = require("./modules/vendors/vendors.module");
const client_module_1 = require("./modules/clients/client.module");
const sites_module_1 = require("./modules/sites/sites.module");
const database_config_1 = __importDefault(require("./config/database.config"));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
            }),
            sequelize_1.SequelizeModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: database_config_1.default,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            rbac_module_1.RbacModule,
            projects_module_1.ProjectsModule,
            boq_module_1.BoqModule,
            client_module_1.ClientsModule,
            sites_module_1.SitesModule,
            vendors_module_1.VendorsModule,
            inventory_module_1.InventoryModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map