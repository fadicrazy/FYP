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
exports.ConsultationSchema = exports.Consultation = exports.ConsultationStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ConsultationStatus;
(function (ConsultationStatus) {
    ConsultationStatus["PENDING"] = "pending";
    ConsultationStatus["ACCEPTED"] = "accepted";
    ConsultationStatus["ACTIVE"] = "active";
    ConsultationStatus["COMPLETED"] = "completed";
    ConsultationStatus["CANCELLED"] = "cancelled";
})(ConsultationStatus || (exports.ConsultationStatus = ConsultationStatus = {}));
let Consultation = class Consultation {
    patientId;
    doctorId;
    nurseId;
    status;
    videoRoomId;
    symptoms;
    notes;
    diagnosis;
    scheduledAt;
    startedAt;
    endedAt;
};
exports.Consultation = Consultation;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Patient', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Consultation.prototype, "patientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Consultation.prototype, "doctorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Consultation.prototype, "nurseId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ConsultationStatus, default: ConsultationStatus.PENDING }),
    __metadata("design:type", String)
], Consultation.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Consultation.prototype, "videoRoomId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Consultation.prototype, "symptoms", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Consultation.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Consultation.prototype, "diagnosis", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Consultation.prototype, "scheduledAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Consultation.prototype, "startedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Consultation.prototype, "endedAt", void 0);
exports.Consultation = Consultation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Consultation);
exports.ConsultationSchema = mongoose_1.SchemaFactory.createForClass(Consultation);
//# sourceMappingURL=consultation.schema.js.map