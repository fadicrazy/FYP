import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: any): Promise<import("./notification.schema").NotificationDocument[]>;
    countUnread(req: any): Promise<number>;
    markAsRead(id: string): Promise<import("./notification.schema").NotificationDocument | null>;
    markAllAsRead(req: any): Promise<any>;
    remove(id: string): Promise<import("./notification.schema").NotificationDocument | null>;
}
