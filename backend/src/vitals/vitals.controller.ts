import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { VitalsService } from './vitals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('vitals')
@UseGuards(JwtAuthGuard)
export class VitalsController {
  constructor(private readonly vitalsService: VitalsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('nurse')
  create(@Body() body: any, @Request() req: any) {
    return this.vitalsService.create({ ...body, recordedBy: req.user.sub });
  }

  @Get(':patientId')
  @UseGuards(RolesGuard)
  @Roles('nurse', 'doctor', 'admin')
  findByPatient(@Param('patientId') patientId: string) {
    return this.vitalsService.findByPatient(patientId);
  }

  @Get('latest/:patientId')
  @UseGuards(RolesGuard)
  @Roles('nurse', 'doctor', 'admin')
  findLatest(@Param('patientId') patientId: string) {
    return this.vitalsService.findLatest(patientId);
  }
}
