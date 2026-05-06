import { VitalsService } from './vitals.service';
export declare class VitalsController {
    private readonly vitalsService;
    constructor(vitalsService: VitalsService);
    create(body: any, req: any): Promise<import("./vital.schema").VitalDocument>;
    findByPatient(patientId: string): Promise<import("./vital.schema").VitalDocument[]>;
    findLatest(patientId: string): Promise<import("./vital.schema").VitalDocument | null>;
}
