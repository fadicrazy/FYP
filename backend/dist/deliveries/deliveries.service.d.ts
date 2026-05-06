import { Model } from 'mongoose';
import { Delivery, DeliveryDocument, DeliveryStatus } from './delivery.schema';
export declare class DeliveriesService {
    private deliveryModel;
    constructor(deliveryModel: Model<DeliveryDocument>);
    create(data: Partial<Delivery>): Promise<DeliveryDocument>;
    findAll(filters?: any): Promise<DeliveryDocument[]>;
    findById(id: string): Promise<DeliveryDocument>;
    updateStatus(id: string, status: DeliveryStatus, trackingNotes?: string): Promise<DeliveryDocument>;
    count(filters?: any): Promise<number>;
    countByStatus(): Promise<any>;
}
