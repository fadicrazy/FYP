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
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const patient_schema_1 = require("./patient.schema");
let PatientsService = class PatientsService {
    patientModel;
    constructor(patientModel) {
        this.patientModel = patientModel;
    }
    async create(data) {
        const patient = new this.patientModel(data);
        return patient.save();
    }
    async findAll() {
        return this.patientModel.find().populate('userId', '-password').exec();
    }
    async findById(id) {
        const patient = await this.patientModel.findById(id).populate('userId', '-password').exec();
        if (!patient)
            throw new common_1.NotFoundException('Patient not found');
        return patient;
    }
    async findByUserId(userId) {
        return this.patientModel.findOne({ userId }).populate('userId', '-password').exec();
    }
    async update(id, data) {
        const patient = await this.patientModel
            .findByIdAndUpdate(id, data, { new: true })
            .populate('userId', '-password')
            .exec();
        if (!patient)
            throw new common_1.NotFoundException('Patient not found');
        return patient;
    }
    async count() {
        return this.patientModel.countDocuments().exec();
    }
    async remove(id) {
        const patient = await this.patientModel.findByIdAndDelete(id).exec();
        if (!patient)
            throw new common_1.NotFoundException('Patient not found');
        return patient;
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(patient_schema_1.Patient.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PatientsService);
//# sourceMappingURL=patients.service.js.map