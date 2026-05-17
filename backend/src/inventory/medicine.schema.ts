import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MedicineDocument = Medicine & Document;

@Schema({ timestamps: true })
export class Medicine {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop({ required: true, default: 10 })
  minStock: number;

  @Prop({ required: true, default: 0 })
  price: number;

  @Prop({ required: true, default: 'Tablet' })
  unit: string;

  @Prop({ default: '' })
  manufacturer: string;
}

export const MedicineSchema = SchemaFactory.createForClass(Medicine);
