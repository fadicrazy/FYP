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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/user.schema");
const patient_schema_1 = require("../patients/patient.schema");
const consultation_schema_1 = require("../consultations/consultation.schema");
const prescription_schema_1 = require("../prescriptions/prescription.schema");
const delivery_schema_1 = require("../deliveries/delivery.schema");
let AdminService = class AdminService {
    userModel;
    patientModel;
    consultationModel;
    prescriptionModel;
    deliveryModel;
    constructor(userModel, patientModel, consultationModel, prescriptionModel, deliveryModel) {
        this.userModel = userModel;
        this.patientModel = patientModel;
        this.consultationModel = consultationModel;
        this.prescriptionModel = prescriptionModel;
        this.deliveryModel = deliveryModel;
    }
    async getStats() {
        const [totalUsers, totalPatients, totalConsultations, totalPrescriptions, totalDeliveries, usersByRole, consultationsByStatus, deliveriesByStatus, recentUsers] = await Promise.all([
            this.userModel.countDocuments(),
            this.patientModel.countDocuments(),
            this.consultationModel.countDocuments(),
            this.prescriptionModel.countDocuments(),
            this.deliveryModel.countDocuments(),
            this.userModel.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
            this.consultationModel.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
            this.deliveryModel.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
            this.userModel.find().select('-password').sort({ createdAt: -1 }).limit(5),
        ]);
        return {
            totalUsers,
            totalPatients,
            totalConsultations,
            totalPrescriptions,
            totalDeliveries,
            usersByRole,
            consultationsByStatus,
            deliveriesByStatus,
            recentUsers,
        };
    }
    async getAllUsers(role) {
        const filter = {};
        if (role)
            filter.role = role;
        return this.userModel.find(filter).select('-password').sort({ createdAt: -1 });
    }
    async approveUser(userId) {
        return this.userModel.findByIdAndUpdate(userId, { isApproved: true }, { new: true }).select('-password');
    }
    async deactivateUser(userId) {
        return this.userModel.findByIdAndUpdate(userId, { isActive: false }, { new: true }).select('-password');
    }
    async deleteUser(userId) {
        return this.userModel.findByIdAndDelete(userId);
    }
    async getActivityLog() {
        const recentConsultations = await this.consultationModel
            .find()
            .populate([
            { path: 'patientId', populate: { path: 'userId', select: 'name' } },
            { path: 'doctorId', select: 'name' },
            { path: 'nurseId', select: 'name' },
        ])
            .sort({ createdAt: -1 })
            .limit(20);
        return recentConsultations;
    }
    async getMonthlyStats() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlyConsultations = await this.consultationModel.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const monthlyRegistrations = await this.userModel.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        return { monthlyConsultations, monthlyRegistrations };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(patient_schema_1.Patient.name)),
    __param(2, (0, mongoose_1.InjectModel)(consultation_schema_1.Consultation.name)),
    __param(3, (0, mongoose_1.InjectModel)(prescription_schema_1.Prescription.name)),
    __param(4, (0, mongoose_1.InjectModel)(delivery_schema_1.Delivery.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AdminService);
//# sourceMappingURL=admin.service.js.map