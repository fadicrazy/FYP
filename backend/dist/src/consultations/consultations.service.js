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
exports.ConsultationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const consultation_schema_1 = require("./consultation.schema");
const crypto_1 = require("crypto");
const notifications_service_1 = require("../notifications/notifications.service");
let ConsultationsService = class ConsultationsService {
    consultationModel;
    notificationsService;
    constructor(consultationModel, notificationsService) {
        this.consultationModel = consultationModel;
        this.notificationsService = notificationsService;
    }
    async create(data) {
        const consultation = new this.consultationModel(data);
        const saved = await consultation.save();
        if (saved.doctorId) {
            await this.notificationsService.create({
                recipientId: saved.doctorId,
                title: 'New Consultation Request',
                message: 'A patient is waiting for consultation.',
                type: 'info',
                link: `/consultations/${saved._id}`
            });
        }
        return saved.populate([
            { path: 'patientId', populate: { path: 'userId', select: '-password' } },
            { path: 'doctorId', select: '-password' },
            { path: 'nurseId', select: '-password' },
        ]);
    }
    async findAll(filters = {}) {
        return this.consultationModel
            .find(filters)
            .populate([
            { path: 'patientId', populate: { path: 'userId', select: '-password' } },
            { path: 'doctorId', select: '-password' },
            { path: 'nurseId', select: '-password' },
        ])
            .sort({ createdAt: -1 })
            .exec();
    }
    async findById(id) {
        const consultation = await this.consultationModel
            .findById(id)
            .populate([
            { path: 'patientId', populate: { path: 'userId', select: '-password' } },
            { path: 'doctorId', select: '-password' },
            { path: 'nurseId', select: '-password' },
        ])
            .exec();
        if (!consultation)
            throw new common_1.NotFoundException('Consultation not found');
        return consultation;
    }
    async findByDoctor(doctorId) {
        return this.findAll({ doctorId });
    }
    async findByPatient(patientId) {
        return this.findAll({ patientId });
    }
    async findPending() {
        return this.findAll({ status: consultation_schema_1.ConsultationStatus.PENDING });
    }
    async accept(id, doctorId) {
        const consultation = await this.consultationModel
            .findByIdAndUpdate(id, { doctorId, status: consultation_schema_1.ConsultationStatus.ACCEPTED }, { new: true })
            .populate([
            { path: 'patientId', populate: { path: 'userId', select: '-password' } },
            { path: 'doctorId', select: '-password' },
            { path: 'nurseId', select: '-password' },
        ])
            .exec();
        if (!consultation)
            throw new common_1.NotFoundException('Consultation not found');
        await this.notificationsService.create({
            recipientId: consultation.nurseId,
            title: 'Consultation Accepted',
            message: 'A doctor has accepted your consultation request.',
            type: 'success',
            link: `/consultations/${consultation._id}`
        });
        return consultation;
    }
    async start(id) {
        const videoRoomId = (0, crypto_1.randomUUID)();
        const consultation = await this.consultationModel
            .findByIdAndUpdate(id, {
            status: consultation_schema_1.ConsultationStatus.ACTIVE,
            videoRoomId,
            startedAt: new Date(),
        }, { new: true })
            .populate([
            { path: 'patientId', populate: { path: 'userId', select: '-password' } },
            { path: 'doctorId', select: '-password' },
            { path: 'nurseId', select: '-password' },
        ])
            .exec();
        if (!consultation)
            throw new common_1.NotFoundException('Consultation not found');
        return consultation;
    }
    async complete(id, notes, diagnosis) {
        const consultation = await this.consultationModel
            .findByIdAndUpdate(id, {
            status: consultation_schema_1.ConsultationStatus.COMPLETED,
            notes,
            diagnosis,
            endedAt: new Date(),
        }, { new: true })
            .populate([
            { path: 'patientId', populate: { path: 'userId', select: '-password' } },
            { path: 'doctorId', select: '-password' },
            { path: 'nurseId', select: '-password' },
        ])
            .exec();
        if (!consultation)
            throw new common_1.NotFoundException('Consultation not found');
        return consultation;
    }
    async cancel(id) {
        const consultation = await this.consultationModel
            .findByIdAndUpdate(id, { status: consultation_schema_1.ConsultationStatus.CANCELLED }, { new: true })
            .exec();
        if (!consultation)
            throw new common_1.NotFoundException('Consultation not found');
        return consultation;
    }
    async count(filters = {}) {
        return this.consultationModel.countDocuments(filters).exec();
    }
    async countByStatus() {
        return this.consultationModel.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]).exec();
    }
};
exports.ConsultationsService = ConsultationsService;
exports.ConsultationsService = ConsultationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(consultation_schema_1.Consultation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notifications_service_1.NotificationsService])
], ConsultationsService);
//# sourceMappingURL=consultations.service.js.map