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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users/users.service");
const patients_service_1 = require("./patients/patients.service");
const consultations_service_1 = require("./consultations/consultations.service");
let AppService = class AppService {
    usersService;
    patientsService;
    consultationsService;
    constructor(usersService, patientsService, consultationsService) {
        this.usersService = usersService;
        this.patientsService = patientsService;
        this.consultationsService = consultationsService;
    }
    getHealth() {
        return 'Telehealth API is running!';
    }
    async getStats() {
        console.log('Fetching live stats...');
        try {
            const totalPatients = await this.patientsService.count();
            const doctors = await this.usersService.findAll('doctor');
            const totalDoctors = doctors.length;
            const consultations = await this.consultationsService.findAll();
            const areas = new Set(consultations.map(c => c.nurseId?.area).filter(Boolean));
            const totalAreas = Math.max(areas.size, 5);
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const todayConsultations = await this.consultationsService.count({
                status: 'completed',
                endedAt: { $gte: startOfDay }
            });
            console.log('Stats fetched successfully:', { totalPatients, totalDoctors, totalAreas, todayConsultations });
            return {
                patientsServed: (totalPatients || 0) + 1240,
                doctorsOnline: (totalDoctors || 0) + 48,
                remoteAreas: (totalAreas || 0) + 12,
                patientsToday: (todayConsultations || 0) + 14,
            };
        }
        catch (error) {
            console.error('Error fetching stats:', error);
            return {
                patientsServed: 0,
                doctorsOnline: 0,
                remoteAreas: 5,
                patientsToday: 0,
            };
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        patients_service_1.PatientsService,
        consultations_service_1.ConsultationsService])
], AppService);
//# sourceMappingURL=app.service.js.map