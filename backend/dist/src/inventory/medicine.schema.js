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
exports.MedicineSchema = exports.Medicine = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Medicine = class Medicine {
    name;
    category;
    stock;
    minStock;
    price;
    unit;
    manufacturer;
};
exports.Medicine = Medicine;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Medicine.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Medicine.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Medicine.prototype, "stock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 10 }),
    __metadata("design:type", Number)
], Medicine.prototype, "minStock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Medicine.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'Tablet' }),
    __metadata("design:type", String)
], Medicine.prototype, "unit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Medicine.prototype, "manufacturer", void 0);
exports.Medicine = Medicine = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Medicine);
exports.MedicineSchema = mongoose_1.SchemaFactory.createForClass(Medicine);
//# sourceMappingURL=medicine.schema.js.map