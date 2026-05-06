import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vital, VitalDocument } from './vital.schema';

@Injectable()
export class VitalsService {
  constructor(@InjectModel(Vital.name) private vitalModel: Model<VitalDocument>) {}

  async create(data: Partial<Vital>): Promise<VitalDocument> {
    const vital = new this.vitalModel(data);
    return vital.save();
  }

  async findByPatient(patientId: string): Promise<VitalDocument[]> {
    return this.vitalModel
      .find({ patientId })
      .populate('recordedBy', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findLatest(patientId: string): Promise<VitalDocument | null> {
    return this.vitalModel
      .findOne({ patientId })
      .populate('recordedBy', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async count(): Promise<number> {
    return this.vitalModel.countDocuments().exec();
  }
}
