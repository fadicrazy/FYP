import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getStats(): Promise<any>;
    create(body: any): Promise<import("./medicine.schema").MedicineDocument>;
    findAll(search?: string, category?: string, lowStock?: string): Promise<import("./medicine.schema").MedicineDocument[]>;
    findOne(id: string): Promise<import("./medicine.schema").MedicineDocument>;
    update(id: string, body: any): Promise<import("./medicine.schema").MedicineDocument>;
    remove(id: string): Promise<any>;
}
