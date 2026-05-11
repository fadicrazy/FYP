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
exports.DeliveriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const delivery_schema_1 = require("./delivery.schema");
let DeliveriesService = class DeliveriesService {
    deliveryModel;
    constructor(deliveryModel) {
        this.deliveryModel = deliveryModel;
    }
    async create(data) {
        const delivery = new this.deliveryModel(data);
        return (await delivery.save()).populate({
            path: 'prescriptionId',
            populate: [
                { path: 'doctorId', select: 'name' },
                { path: 'patientId', populate: { path: 'userId', select: 'name' } },
            ],
        });
    }
    async findAll(filters = {}) {
        return this.deliveryModel
            .find(filters)
            .populate({
            path: 'prescriptionId',
            populate: [
                { path: 'doctorId', select: 'name' },
                { path: 'patientId', populate: { path: 'userId', select: 'name' } },
            ],
        })
            .populate('pharmacyId', 'name')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findById(id) {
        const delivery = await this.deliveryModel
            .findById(id)
            .populate({
            path: 'prescriptionId',
            populate: [
                { path: 'doctorId', select: 'name specialization' },
                { path: 'patientId', populate: { path: 'userId', select: 'name email phone' } },
            ],
        })
            .populate('pharmacyId', 'name')
            .exec();
        if (!delivery)
            throw new common_1.NotFoundException('Delivery not found');
        return delivery;
    }
    async updateStatus(id, status, trackingNotes) {
        const updateData = { status };
        if (trackingNotes)
            updateData.trackingNotes = trackingNotes;
        if (status === delivery_schema_1.DeliveryStatus.DELIVERED)
            updateData.deliveredAt = new Date();
        const delivery = await this.deliveryModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate({
            path: 'prescriptionId',
            populate: [
                { path: 'doctorId', select: 'name' },
                { path: 'patientId', populate: { path: 'userId', select: 'name' } },
            ],
        })
            .exec();
        if (!delivery)
            throw new common_1.NotFoundException('Delivery not found');
        return delivery;
    }
    async count(filters = {}) {
        return this.deliveryModel.countDocuments(filters).exec();
    }
    async countByStatus() {
        return this.deliveryModel.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]).exec();
    }
};
exports.DeliveriesService = DeliveriesService;
exports.DeliveriesService = DeliveriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(delivery_schema_1.Delivery.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DeliveriesService);
//# sourceMappingURL=deliveries.service.js.map