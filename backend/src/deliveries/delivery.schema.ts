import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DeliveryDocument = Delivery & Document;

export enum DeliveryStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Delivery {
  @Prop({ type: Types.ObjectId, ref: 'Prescription', required: true })
  prescriptionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  pharmacyId: Types.ObjectId;

  @Prop({ enum: DeliveryStatus, default: DeliveryStatus.PENDING })
  status: DeliveryStatus;

  @Prop({ default: '' })
  trackingNotes: string;

  @Prop({ default: '' })
  deliveryAddress: string;

  @Prop()
  estimatedDelivery: Date;

  @Prop()
  deliveredAt: Date;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
