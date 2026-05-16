import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';
export declare class NotificationsService {
    private notificationModel;
    constructor(notificationModel: Model<NotificationDocument>);
    create(data: Partial<Notification>): Promise<NotificationDocument>;
    findAll(recipientId: string): Promise<NotificationDocument[]>;
    countUnread(recipientId: string): Promise<number>;
    markAsRead(id: string): Promise<NotificationDocument | null>;
    markAllAsRead(recipientId: string): Promise<any>;
    remove(id: string): Promise<NotificationDocument | null>;
}
