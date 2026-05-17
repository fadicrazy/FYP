import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prescription, PrescriptionDocument } from './prescription.schema';
import { Medicine, MedicineDocument } from '../inventory/medicine.schema';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectModel(Prescription.name) private prescriptionModel: Model<PrescriptionDocument>,
    @InjectModel(Medicine.name) private medicineModel: Model<MedicineDocument>,
  ) {}

  async create(data: Partial<Prescription>): Promise<PrescriptionDocument> {
    const prescription = new this.prescriptionModel(data);
    const saved = await prescription.save();

    // Deduct stock for each prescribed medicine in inventory
    if (data.medicines && Array.isArray(data.medicines)) {
      for (const med of data.medicines) {
        if (med.name) {
          const medicineObj = await this.medicineModel.findOne({
            name: { $regex: new RegExp(`^${med.name.trim()}$`, 'i') }
          }).exec();

          if (medicineObj) {
            // Intelligent parser for clinical dosage rules
            let timesPerDay = 2; // Default fallback
            let durationDays = 7; // Default fallback

            // 1. Parse Frequency (e.g. '3x/day', 'twice daily', 'once/day')
            if (med.frequency) {
              const freqStr = med.frequency.toLowerCase();
              const matchTimes = freqStr.match(/(\d+)\s*(x|time)/i);
              if (matchTimes && matchTimes[1]) {
                timesPerDay = parseInt(matchTimes[1], 10);
              } else if (freqStr.includes('once') || freqStr.includes('1x') || freqStr.includes('daily') || freqStr.includes('od')) {
                timesPerDay = 1;
              } else if (freqStr.includes('twice') || freqStr.includes('2x') || freqStr.includes('bid') || freqStr.includes('bd')) {
                timesPerDay = 2;
              } else if (freqStr.includes('thrice') || freqStr.includes('3x') || freqStr.includes('tid') || freqStr.includes('tds')) {
                timesPerDay = 3;
              } else if (freqStr.includes('four') || freqStr.includes('4x') || freqStr.includes('qid')) {
                timesPerDay = 4;
              }
            }

            // 2. Parse Duration (e.g. '7 days', '2 weeks', '1 month', '5')
            if (med.duration) {
              const durStr = med.duration.toLowerCase();
              const matchDays = durStr.match(/(\d+)\s*day/i);
              const matchWeeks = durStr.match(/(\d+)\s*week/i);
              const matchMonths = durStr.match(/(\d+)\s*month/i);

              if (matchDays && matchDays[1]) {
                durationDays = parseInt(matchDays[1], 10);
              } else if (matchWeeks && matchWeeks[1]) {
                durationDays = parseInt(matchWeeks[1], 10) * 7;
              } else if (matchMonths && matchMonths[1]) {
                durationDays = parseInt(matchMonths[1], 10) * 30;
              } else if (durStr.includes('week')) {
                durationDays = 7;
              } else if (durStr.includes('month')) {
                durationDays = 30;
              } else {
                const matchRawNum = durStr.match(/(\d+)/);
                if (matchRawNum && matchRawNum[1]) {
                  durationDays = parseInt(matchRawNum[1], 10);
                }
              }
            }

            const quantityToDeduct = timesPerDay * durationDays;
            medicineObj.stock = Math.max(0, medicineObj.stock - quantityToDeduct);
            await medicineObj.save();
            console.log(`📉 Dynamic stock update: ${medicineObj.name} decreased by ${quantityToDeduct} (Freq: ${med.frequency}, Dur: ${med.duration}). New stock: ${medicineObj.stock}`);
          }
        }
      }
    }

    return saved.populate([
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
