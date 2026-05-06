// User schema — supports all roles: admin, doctor, nurse, patient, pharmacy
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  PATIENT = 'patient',
  PHARMACY = 'pharmacy',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: '' })
  specialization: string; // For doctors

  @Prop({ default: '' })
  licenseNumber: string; // For doctors

  @Prop({ default: '' })
  area: string; // For nurses — assigned area

  @Prop({ default: true })
  isApproved: boolean; // Doctors need admin approval

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
