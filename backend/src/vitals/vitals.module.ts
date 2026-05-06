import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VitalsService } from './vitals.service';
import { VitalsController } from './vitals.controller';
import { Vital, VitalSchema } from './vital.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Vital.name, schema: VitalSchema }])],
  controllers: [VitalsController],
  providers: [VitalsService],
  exports: [VitalsService],
})
export class VitalsModule {}
