import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from './patient.schema';

@Injectable()
export class PatientsService {
  constructor(@InjectModel(Patient.name) private patientModel: Model<PatientDocument>) {}

  async create(data: Partial<Patient>): Promise<PatientDocument> {
    const patient = new this.patientModel(data);
    return patient.save();
  }

  async findAll(): Promise<PatientDocument[]> {
    return this.patientModel.find().populate('userId', '-password').exec();
  }

  async findById(id: string): Promise<PatientDocument> {
    const patient = await this.patientModel.findById(id).populate('userId', '-password').exec();
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  async findByUserId(userId: string): Promise<PatientDocument | null> {
    return this.patientModel.findOne({ userId }).populate('userId', '-password').exec();
  }

  async update(id: string, data: Partial<Patient>): Promise<PatientDocument> {
    const patient = await this.patientModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('userId', '-password')
      .exec();
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  async count(): Promise<number> {
    return this.patientModel.countDocuments().exec();
  }

  async remove(id: string): Promise<any> {
    const patient = await this.patientModel.findByIdAndDelete(id).exec();
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }
}
