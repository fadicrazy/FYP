import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Medicine, MedicineSchema } from './medicine.schema';
import { Prescription, PrescriptionSchema } from '../prescriptions/prescription.schema';
import { Delivery, DeliverySchema } from '../deliveries/delivery.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Medicine.name, schema: MedicineSchema },
      { name: Prescription.name, schema: PrescriptionSchema },
      { name: Delivery.name, schema: DeliverySchema },
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
