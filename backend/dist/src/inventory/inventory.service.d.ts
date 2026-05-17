import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Medicine, MedicineDocument } from './medicine.schema';
import { PrescriptionDocument } from '../prescriptions/prescription.schema';
import { DeliveryDocument } from '../deliveries/delivery.schema';
export declare class InventoryService implements OnModuleInit {
    private medicineModel;
    private prescriptionModel;
    private deliveryModel;
    constructor(medicineModel: Model<MedicineDocument>, prescriptionModel: Model<PrescriptionDocument>, deliveryModel: Model<DeliveryDocument>);
    onModuleInit(): Promise<void>;
    create(data: Partial<Medicine>): Promise<MedicineDocument>;
    findAll(filters?: any): Promise<MedicineDocument[]>;
    findOne(id: string): Promise<MedicineDocument>;
    update(id: string, data: Partial<Medicine>): Promise<MedicineDocument>;
    remove(id: string): Promise<any>;
    getPharmacyStats(): Promise<any>;
}
