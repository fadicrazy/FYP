import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVitalDto {
  @IsNotEmpty()
  @IsString()
  patientId: string;

  @IsNotEmpty()
  @IsString()
  bloodPressure: string;

  @IsNotEmpty()
  @IsNumber()
  temperature: number;

  @IsNotEmpty()
  @IsNumber()
  sugarLevel: number;

  @IsNotEmpty()
  @IsNumber()
  pulse: number;

  @IsOptional()
  @IsNumber()
  oxygenSaturation?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
