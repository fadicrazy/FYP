import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Delivery, DeliveryDocument, DeliveryStatus } from './delivery.schema';

@Injectable()
export class DeliveriesService {
  constructor(@InjectModel(Delivery.name) private deliveryModel: Model<DeliveryDocument>) {}

  async create(data: Partial<Delivery>): Promise<DeliveryDocument> {
    const delivery = new this.deliveryModel(data);
    return (await delivery.save()).populate({
      path: 'prescriptionId',
      populate: [
        { path: 'doctorId', select: 'name' },
        { path: 'patientId', populate: { path: 'userId', select: 'name' } },
      ],
    });
  }

  async findAll(filters: any = {}): Promise<DeliveryDocument[]> {
    return this.deliveryModel
      .find(filters)
      .populate({
        path: 'prescriptionId',
        populate: [
          { path: 'doctorId', select: 'name' },
          { path: 'patientId', populate: { path: 'userId', select: 'name' } },
        ],
      })
      .populate('pharmacyId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<DeliveryDocument> {
    const delivery = await this.deliveryModel
      .findById(id)
      .populate({
        path: 'prescriptionId',
        populate: [
          { path: 'doctorId', select: 'name specialization' },
          { path: 'patientId', populate: { path: 'userId', select: 'name email phone' } },
        ],
      })
      .populate('pharmacyId', 'name')
      .exec();
    if (!delivery) throw new NotFoundException('Delivery not found');
    return delivery;
  }

  async updateStatus(id: string, status: DeliveryStatus, trackingNotes?: string): Promise<DeliveryDocument> {
    const updateData: any = { status };
    if (trackingNotes) updateData.trackingNotes = trackingNotes;
    if (status === DeliveryStatus.DELIVERED) updateData.deliveredAt = new Date();

    const delivery = await this.deliveryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate({
        path: 'prescriptionId',
        populate: [
          { path: 'doctorId', select: 'name' },
          { path: 'patientId', populate: { path: 'userId', select: 'name' } },
        ],
      })
      .exec();
    if (!delivery) throw new NotFoundException('Delivery not found');
    return delivery;
  }

  async count(filters: any = {}): Promise<number> {
    return this.deliveryModel.countDocuments(filters).exec();
  }

  async countByStatus(): Promise<any> {
    return this.deliveryModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]).exec();
  }

  async remove(id: string): Promise<any> {
    const result = await this.deliveryModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Delivery not found');
    return result;
  }
}
