import { Model } from 'mongoose';
import { Vital, VitalDocument } from './vital.schema';
export declare class VitalsService {
    private vitalModel;
    constructor(vitalModel: Model<VitalDocument>);
    create(data: Partial<Vital>): Promise<VitalDocument>;
    findByPatient(patientId: string): Promise<VitalDocument[]>;
    findLatest(patientId: string): Promise<VitalDocument | null>;
    count(): Promise<number>;
}
