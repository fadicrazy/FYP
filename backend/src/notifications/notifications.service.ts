import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(data: Partial<Notification>): Promise<NotificationDocument> {
    const notification = new this.notificationModel(data);
    return notification.save();
  }

  async findAll(recipientId: string): Promise<NotificationDocument[]> {
    return this.notificationModel
      .find({ recipientId })
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();
  }

  async countUnread(recipientId: string): Promise<number> {
    return this.notificationModel.countDocuments({ recipientId, isRead: false }).exec();
  }

  async markAsRead(id: string): Promise<NotificationDocument | null> {
    return this.notificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true }).exec();
  }

  async markAllAsRead(recipientId: string): Promise<any> {
    return this.notificationModel.updateMany({ recipientId, isRead: false }, { isRead: true }).exec();
  }

  async remove(id: string): Promise<NotificationDocument | null> {
    return this.notificationModel.findByIdAndDelete(id).exec();
  }
}
