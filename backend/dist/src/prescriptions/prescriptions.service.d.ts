import { Model } from 'mongoose';
import { Prescription, PrescriptionDocument } from './prescription.schema';
import { MedicineDocument } from '../inventory/medicine.schema';
export declare class PrescriptionsService {
    private prescriptionModel;
    private medicineModel;
    constructor(prescriptionModel: Model<PrescriptionDocument>, medicineModel: Model<MedicineDocument>);
    create(data: Partial<Prescription>): Promise<PrescriptionDocument>;
    findById(id: string): Promise<PrescriptionDocument>;
    findByPatient(patientId: string): Promise<PrescriptionDocument[]>;
    findAll(): Promise<PrescriptionDocument[]>;
    count(): Promise<number>;
}
