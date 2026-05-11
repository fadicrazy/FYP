import { Model } from 'mongoose';
import { Prescription, PrescriptionDocument } from './prescription.schema';
export declare class PrescriptionsService {
    private prescriptionModel;
    constructor(prescriptionModel: Model<PrescriptionDocument>);
    create(data: Partial<Prescription>): Promise<PrescriptionDocument>;
    findById(id: string): Promise<PrescriptionDocument>;
    findByPatient(patientId: string): Promise<PrescriptionDocument[]>;
    findAll(): Promise<PrescriptionDocument[]>;
    count(): Promise<number>;
}
