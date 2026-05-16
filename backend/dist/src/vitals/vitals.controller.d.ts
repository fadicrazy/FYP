import { VitalsService } from './vitals.service';
import { CreateVitalDto } from './dto/create-vital.dto';
export declare class VitalsController {
    private readonly vitalsService;
    constructor(vitalsService: VitalsService);
    create(createVitalDto: CreateVitalDto, req: any): Promise<import("./vital.schema").VitalDocument>;
    findByPatient(patientId: string): Promise<import("./vital.schema").VitalDocument[]>;
    findLatest(patientId: string): Promise<import("./vital.schema").VitalDocument | null>;
}
