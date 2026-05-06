import { DeliveriesService } from './deliveries.service';
export declare class DeliveriesController {
    private readonly deliveriesService;
    constructor(deliveriesService: DeliveriesService);
    create(body: any, req: any): Promise<import("./delivery.schema").DeliveryDocument>;
    findAll(status?: string): Promise<import("./delivery.schema").DeliveryDocument[]>;
    findOne(id: string): Promise<import("./delivery.schema").DeliveryDocument>;
    updateStatus(id: string, body: {
        status: string;
        trackingNotes?: string;
    }): Promise<import("./delivery.schema").DeliveryDocument>;
}
