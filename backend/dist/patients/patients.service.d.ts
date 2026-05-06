import { Model } from 'mongoose';
import { Patient, PatientDocument } from './patient.schema';
export declare class PatientsService {
    private patientModel;
    constructor(patientModel: Model<PatientDocument>);
    create(data: Partial<Patient>): Promise<PatientDocument>;
    findAll(): Promise<PatientDocument[]>;
    findById(id: string): Promise<PatientDocument>;
    findByUserId(userId: string): Promise<PatientDocument | null>;
    update(id: string, data: Partial<Patient>): Promise<PatientDocument>;
    count(): Promise<number>;
}
