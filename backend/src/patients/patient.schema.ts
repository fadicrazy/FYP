import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema({ timestamps: true })
export class Patient {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true, enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop({ default: '' })
  address: string;

  @Prop({ default: '' })
  bloodGroup: string;

  @Prop({ type: [String], default: [] })
  medicalHistory: string[];

  @Prop({ type: [String], default: [] })
  allergies: string[];

  @Prop({ default: '' })
  emergencyContact: string;

  @Prop({ default: '' })
  emergencyContactName: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
