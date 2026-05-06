import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prescription, PrescriptionDocument } from './prescription.schema';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectModel(Prescription.name) private prescriptionModel: Model<PrescriptionDocument>,
  ) {}

  async create(data: Partial<Prescription>): Promise<PrescriptionDocument> {
    const prescription = new this.prescriptionModel(data);
    return (await prescription.save()).populate([
      { path: 'consultationId' },
      { path: 'doctorId', select: '-password' },
      { path: 'patientId', populate: { path: 'userId', select: '-password' } },
    ]);
  }

  async findById(id: string): Promise<PrescriptionDocument> {
    const prescription = await this.prescriptionModel
      .findById(id)
      .populate([
        { path: 'consultationId' },
        { path: 'doctorId', select: '-password' },
        { path: 'patientId', populate: { path: 'userId', select: '-password' } },
      ])
      .exec();
    if (!prescription) throw new NotFoundException('Prescription not found');
    return prescription;
  }

  async findByPatient(patientId: string): Promise<PrescriptionDocument[]> {
    return this.prescriptionModel
      .find({ patientId })
      .populate([
        { path: 'doctorId', select: 'name specialization' },
      ])
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAll(): Promise<PrescriptionDocument[]> {
    return this.prescriptionModel
      .find()
      .populate([
        { path: 'doctorId', select: 'name specialization' },
        { path: 'patientId', populate: { path: 'userId', select: 'name email' } },
      ])
      .sort({ createdAt: -1 })
      .exec();
  }

  async count(): Promise<number> {
    return this.prescriptionModel.countDocuments().exec();
  }
}
