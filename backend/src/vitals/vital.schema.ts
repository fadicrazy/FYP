import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VitalDocument = Vital & Document;

@Schema({ timestamps: true })
export class Vital {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;

  @Prop({ required: true })
  bloodPressure: string; // e.g. "120/80"

  @Prop({ required: true })
  temperature: number; // in °F

  @Prop({ required: true })
  sugarLevel: number; // mg/dL

  @Prop({ required: true })
  pulse: number; // BPM

  @Prop({ default: 0 })
  oxygenSaturation: number; // SpO2 %

  @Prop({ default: 0 })
  weight: number; // kg

  @Prop({ default: 0 })
  height: number; // cm

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recordedBy: Types.ObjectId; // nurse ID

  @Prop({ default: '' })
  notes: string;
}

export const VitalSchema = SchemaFactory.createForClass(Vital);
