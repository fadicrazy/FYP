import { PrescriptionsService } from './prescriptions.service';
export declare class PrescriptionsController {
    private readonly prescriptionsService;
    constructor(prescriptionsService: PrescriptionsService);
    create(body: any, req: any): Promise<import("./prescription.schema").PrescriptionDocument>;
    findAll(): Promise<import("./prescription.schema").PrescriptionDocument[]>;
    findOne(id: string): Promise<import("./prescription.schema").PrescriptionDocument>;
    findByPatient(patientId: string): Promise<import("./prescription.schema").PrescriptionDocument[]>;
}
