"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RekiPhoto = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const reki_reports_model_1 = require("./reki_reports.model");
let RekiPhoto = class RekiPhoto extends sequelize_typescript_1.Model {
};
exports.RekiPhoto = RekiPhoto;
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true }),
    __metadata("design:type", Object)
], RekiPhoto.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => reki_reports_model_1.RekiReport),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], RekiPhoto.prototype, "reki_report_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RekiPhoto.prototype, "photo_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RekiPhoto.prototype, "photo_url", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => reki_reports_model_1.RekiReport),
    __metadata("design:type", Object)
], RekiPhoto.prototype, "report", void 0);
exports.RekiPhoto = RekiPhoto = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'reki_photos',
        timestamps: false,
    })
], RekiPhoto);
//# sourceMappingURL=reki_photos.model.js.map