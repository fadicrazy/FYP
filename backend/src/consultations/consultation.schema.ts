import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConsultationDocument = Consultation & Document;

export enum ConsultationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Consultation {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  doctorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  nurseId: Types.ObjectId;

  @Prop({ enum: ConsultationStatus, default: ConsultationStatus.PENDING })
  status: ConsultationStatus;

  @Prop({ default: '' })
  videoRoomId: string;

  @Prop({ default: '' })
  symptoms: string;

  @Prop({ default: '' })
  notes: string;

  @Prop({ default: '' })
  diagnosis: string;

  @Prop()
  scheduledAt: Date;

  @Prop()
  startedAt: Date;

  @Prop()
  endedAt: Date;
}

export const ConsultationSchema = SchemaFactory.createForClass(Consultation);
