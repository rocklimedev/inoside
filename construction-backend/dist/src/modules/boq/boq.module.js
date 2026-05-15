"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoqModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const boq_service_1 = require("./boq.service");
const boq_controller_1 = require("./boq.controller");
const unit_model_1 = require("./models/unit.model");
const boq_category_model_1 = require("./models/boq-category.model");
const boq_model_1 = require("./models/boq.model");
const boq_section_model_1 = require("./models/boq-section.model");
const boq_subheading_model_1 = require("./models/boq-subheading.model");
const boq_item_model_1 = require("./models/boq-item.model");
const inventory_item_model_1 = require("../inventory/models/inventory-item.model");
let BoqModule = class BoqModule {
};
exports.BoqModule = BoqModule;
exports.BoqModule = BoqModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                unit_model_1.Unit,
                boq_category_model_1.BoqCategory,
                boq_model_1.Boq,
                boq_section_model_1.BoqSection,
                boq_subheading_model_1.BoqSubHeading,
                boq_item_model_1.BoqItem,
                inventory_item_model_1.InventoryItem,
            ]),
        ],
        controllers: [boq_controller_1.BoqController],
        providers: [boq_service_1.BoqService],
        exports: [boq_service_1.BoqService],
    })
], BoqModule);
//# sourceMappingURL=boq.module.js.map