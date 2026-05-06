import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User, UserSchema } from '../users/user.schema';
import { Patient, PatientSchema } from '../patients/patient.schema';
import { Consultation, ConsultationSchema } from '../consultations/consultation.schema';
import { Prescription, PrescriptionSchema } from '../prescriptions/prescription.schema';
import { Delivery, DeliverySchema } from '../deliveries/delivery.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: Consultation.name, schema: ConsultationSchema },
      { name: Prescription.name, schema: PrescriptionSchema },
      { name: Delivery.name, schema: DeliverySchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
