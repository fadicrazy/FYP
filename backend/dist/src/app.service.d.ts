import { UsersService } from './users/users.service';
import { PatientsService } from './patients/patients.service';
import { ConsultationsService } from './consultations/consultations.service';
export declare class AppService {
    private readonly usersService;
    private readonly patientsService;
    private readonly consultationsService;
    constructor(usersService: UsersService, patientsService: PatientsService, consultationsService: ConsultationsService);
    getHealth(): string;
    getStats(): Promise<{
        patientsServed: number;
        doctorsOnline: number;
        remoteAreas: number;
        patientsToday: number;
    }>;
}
