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
exports.PrescriptionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const prescription_schema_1 = require("./prescription.schema");
const medicine_schema_1 = require("../inventory/medicine.schema");
let PrescriptionsService = class PrescriptionsService {
    prescriptionModel;
    medicineModel;
    constructor(prescriptionModel, medicineModel) {
        this.prescriptionModel = prescriptionModel;
        this.medicineModel = medicineModel;
    }
    async create(data) {
        const prescription = new this.prescriptionModel(data);
        const saved = await prescription.save();
        if (data.medicines && Array.isArray(data.medicines)) {
            for (const med of data.medicines) {
                if (med.name) {
                    const medicineObj = await this.medicineModel.findOne({
                        name: { $regex: new RegExp(`^${med.name.trim()}$`, 'i') }
                    }).exec();
                    if (medicineObj) {
                        let timesPerDay = 2;
                        let durationDays = 7;
                        if (med.frequency) {
                            const freqStr = med.frequency.toLowerCase();
                            const matchTimes = freqStr.match(/(\d+)\s*(x|time)/i);
                            if (matchTimes && matchTimes[1]) {
                                timesPerDay = parseInt(matchTimes[1], 10);
                            }
                            else if (freqStr.includes('once') || freqStr.includes('1x') || freqStr.includes('daily') || freqStr.includes('od')) {
                                timesPerDay = 1;
                            }
                            else if (freqStr.includes('twice') || freqStr.includes('2x') || freqStr.includes('bid') || freqStr.includes('bd')) {
                                timesPerDay = 2;
                            }
                            else if (freqStr.includes('thrice') || freqStr.includes('3x') || freqStr.includes('tid') || freqStr.includes('tds')) {
                                timesPerDay = 3;
                            }
                            else if (freqStr.includes('four') || freqStr.includes('4x') || freqStr.includes('qid')) {
                                timesPerDay = 4;
                            }
                        }
                        if (med.duration) {
                            const durStr = med.duration.toLowerCase();
                            const matchDays = durStr.match(/(\d+)\s*day/i);
                            const matchWeeks = durStr.match(/(\d+)\s*week/i);
                            const matchMonths = durStr.match(/(\d+)\s*month/i);
                            if (matchDays && matchDays[1]) {
                                durationDays = parseInt(matchDays[1], 10);
                            }
                            else if (matchWeeks && matchWeeks[1]) {
                                durationDays = parseInt(matchWeeks[1], 10) * 7;
                            }
                            else if (matchMonths && matchMonths[1]) {
                                durationDays = parseInt(matchMonths[1], 10) * 30;
                            }
                            else if (durStr.includes('week')) {
                                durationDays = 7;
                            }
                            else if (durStr.includes('month')) {
                                durationDays = 30;
                            }
                            else {
                                const matchRawNum = durStr.match(/(\d+)/);
                                if (matchRawNum && matchRawNum[1]) {
                                    durationDays = parseInt(matchRawNum[1], 10);
                                }
                            }
                        }
                        const quantityToDeduct = timesPerDay * durationDays;
                        medicineObj.stock = Math.max(0, medicineObj.stock - quantityToDeduct);
                        await medicineObj.save();
                        console.log(`📉 Dynamic stock update: ${medicineObj.name} decreased by ${quantityToDeduct} (Freq: ${med.frequency}, Dur: ${med.duration}). New stock: ${medicineObj.stock}`);
                    }
                }
            }
        }
        return saved.populate([
            { path: 'consultationId' },
            { path: 'doctorId', select: '-password' },
            { path: 'patientId', populate: { path: 'userId', select: '-password' } },
        ]);
    }
    async findById(id) {
        const prescription = await this.prescriptionModel
            .findById(id)
            .populate([
            { path: 'consultationId' },
            { path: 'doctorId', select: '-password' },
            { path: 'patientId', populate: { path: 'userId', select: '-password' } },
        ])
            .exec();
        if (!prescription)
            throw new common_1.NotFoundException('Prescription not found');
        return prescription;
    }
    async findByPatient(patientId) {
        return this.prescriptionModel
            .find({ patientId })
            .populate([
            { path: 'doctorId', select: 'name specialization' },
        ])
            .sort({ createdAt: -1 })
            .exec();
    }
    async findAll() {
        return this.prescriptionModel
            .find()
            .populate([
            { path: 'doctorId', select: 'name specialization' },
            { path: 'patientId', populate: { path: 'userId', select: 'name email' } },
        ])
            .sort({ createdAt: -1 })
            .exec();
    }
    async count() {
        return this.prescriptionModel.countDocuments().exec();
    }
};
exports.PrescriptionsService = PrescriptionsService;
exports.PrescriptionsService = PrescriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(prescription_schema_1.Prescription.name)),
    __param(1, (0, mongoose_1.InjectModel)(medicine_schema_1.Medicine.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PrescriptionsService);
//# sourceMappingURL=prescriptions.service.js.map