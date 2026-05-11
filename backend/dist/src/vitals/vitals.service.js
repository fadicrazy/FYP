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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VitalsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const vital_schema_1 = require("./vital.schema");
let VitalsService = class VitalsService {
    vitalModel;
    constructor(vitalModel) {
        this.vitalModel = vitalModel;
    }
    async create(data) {
        const vital = new this.vitalModel(data);
        return vital.save();
    }
    async findByPatient(patientId) {
        return this.vitalModel
            .find({ patientId })
            .populate('recordedBy', 'name')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findLatest(patientId) {
        return this.vitalModel
            .findOne({ patientId })
            .populate('recordedBy', 'name')
            .sort({ createdAt: -1 })
            .exec();
    }
    async count() {
        return this.vitalModel.countDocuments().exec();
    }
};
exports.VitalsService = VitalsService;
exports.VitalsService = VitalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(vital_schema_1.Vital.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], VitalsService);
//# sourceMappingURL=vitals.service.js.map