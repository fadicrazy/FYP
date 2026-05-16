import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Consultation, ConsultationDocument, ConsultationStatus } from './consultation.schema';
import { randomUUID } from 'crypto'; 
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectModel(Consultation.name) private consultationModel: Model<ConsultationDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(data: Partial<Consultation>): Promise<ConsultationDocument> {
    const consultation = new this.consultationModel(data);
    const saved = await consultation.save();
    
    // Notify doctor or broadcast to all doctors (for now just a generic log)
    // In a real app, you might notify a specific doctor if assigned
    if (saved.doctorId) {
      await this.notificationsService.create({
        recipientId: saved.doctorId as any,
        title: 'New Consultation Request',
        message: 'A patient is waiting for consultation.',
        type: 'info',
        link: `/consultations/${saved._id}`
      });
    }

    return saved.populate([
      { path: 'patientId', populate: { path: 'userId', select: '-password' } },
      { path: 'doctorId', select: '-password' },
      { path: 'nurseId', select: '-password' },
    ]);
  }

  async findAll(filters: any = {}): Promise<ConsultationDocument[]> {
    return this.consultationModel
      .find(filters)
      .populate([
        { path: 'patientId', populate: { path: 'userId', select: '-password' } },
        { path: 'doctorId', select: '-password' },
        { path: 'nurseId', select: '-password' },
      ])
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<ConsultationDocument> {
    const consultation = await this.consultationModel
      .findById(id)
      .populate([
        { path: 'patientId', populate: { path: 'userId', select: '-password' } },
        { path: 'doctorId', select: '-password' },
        { path: 'nurseId', select: '-password' },
      ])
      .exec();
    if (!consultation) throw new NotFoundException('Consultation not found');
    return consultation;
  }

  async findByDoctor(doctorId: string): Promise<ConsultationDocument[]> {
    return this.findAll({ doctorId });
  }

  async findByPatient(patientId: string): Promise<ConsultationDocument[]> {
    return this.findAll({ patientId });
  }

  async findPending(): Promise<ConsultationDocument[]> {
    return this.findAll({ status: ConsultationStatus.PENDING });
  }

  async accept(id: string, doctorId: string): Promise<ConsultationDocument> {
    const consultation = await this.consultationModel
      .findByIdAndUpdate(
        id,
        { doctorId, status: ConsultationStatus.ACCEPTED },
        { new: true },
      )
      .populate([
        { path: 'patientId', populate: { path: 'userId', select: '-password' } },
        { path: 'doctorId', select: '-password' },
        { path: 'nurseId', select: '-password' },
      ])
      .exec();
    if (!consultation) throw new NotFoundException('Consultation not found');

    // Notify Nurse
    await this.notificationsService.create({
      recipientId: consultation.nurseId as any,
      title: 'Consultation Accepted',
      message: 'A doctor has accepted your consultation request.',
      type: 'success',
      link: `/consultations/${consultation._id}`
    });

    return consultation;
  }

  async start(id: string): Promise<ConsultationDocument> {
    const videoRoomId = randomUUID(); // ✅ uuidv4() ki jagah randomUUID()
    const consultation = await this.consultationModel
      .findByIdAndUpdate(
        id,
        {
          status: ConsultationStatus.ACTIVE,
          videoRoomId,
          startedAt: new Date(),
        },
        { new: true },
      )
      .populate([
        { path: 'patientId', populate: { path: 'userId', select: '-password' } },
        { path: 'doctorId', select: '-password' },
        { path: 'nurseId', select: '-password' },
      ])
      .exec();
    if (!consultation) throw new NotFoundException('Consultation not found');
    return consultation;
  }

  async complete(id: string, notes: string, diagnosis: string): Promise<ConsultationDocument> {
    const consultation = await this.consultationModel
      .findByIdAndUpdate(
        id,
        {
          status: ConsultationStatus.COMPLETED,
          notes,
          diagnosis,
          endedAt: new Date(),
        },
        { new: true },
      )
      .populate([
        { path: 'patientId', populate: { path: 'userId', select: '-password' } },
        { path: 'doctorId', select: '-password' },
        { path: 'nurseId', select: '-password' },
      ])
      .exec();
    if (!consultation) throw new NotFoundException('Consultation not found');
    return consultation;
  }

  async cancel(id: string): Promise<ConsultationDocument> {
    const consultation = await this.consultationModel
      .findByIdAndUpdate(id, { status: ConsultationStatus.CANCELLED }, { new: true })
      .exec();
    if (!consultation) throw new NotFoundException('Consultation not found');
    return consultation;
  }

  async count(filters: any = {}): Promise<number> {
    return this.consultationModel.countDocuments(filters).exec();
  }

  async countByStatus(): Promise<any> {
    return this.consultationModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]).exec();
  }
}