import { PatientsService } from './patients.service';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    create(body: any): Promise<import("./patient.schema").PatientDocument>;
    findAll(): Promise<import("./patient.schema").PatientDocument[]>;
    getMyProfile(req: any): Promise<import("./patient.schema").PatientDocument | null>;
    findOne(id: string): Promise<import("./patient.schema").PatientDocument>;
    update(id: string, body: any): Promise<import("./patient.schema").PatientDocument>;
}
