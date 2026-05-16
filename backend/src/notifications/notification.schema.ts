import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recipientId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'info' })
  type: string; // info, success, warning, error

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: '' })
  link: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
