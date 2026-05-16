import { Controller, Get, Post, Put, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('consultations')
@UseGuards(JwtAuthGuard)
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post('request')
  @UseGuards(RolesGuard)
  @Roles('nurse')
  create(@Body() body: any, @Request() req: any) {
    return this.consultationsService.create({ ...body, nurseId: req.user.sub as any });
  }

  @Get()
  findAll(@Query('status') status?: string, @Query('doctorId') doctorId?: string) {
    const filters: any = {};
    if (status) filters.status = status;
    if (doctorId) filters.doctorId = doctorId;
    return this.consultationsService.findAll(filters);
  }

  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles('doctor', 'admin')
  findPending() {
    return this.consultationsService.findPending();
  }

  @Get('my-consultations')
  findMyConsultations(@Request() req: any) {
    if (req.user.role === 'doctor') {
      return this.consultationsService.findByDoctor(req.user.sub);
    }
    return this.consultationsService.findAll({ nurseId: req.user.sub });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultationsService.findById(id);
  }

  @Put(':id/accept')
  @UseGuards(RolesGuard)
  @Roles('doctor')
  accept(@Param('id') id: string, @Request() req: any) {
    return this.consultationsService.accept(id, req.user.sub);
  }

  @Put(':id/start')
  @UseGuards(RolesGuard)
  @Roles('doctor')
  start(@Param('id') id: string) {
    return this.consultationsService.start(id);
  }

  @Put(':id/complete')
  @UseGuards(RolesGuard)
  @Roles('doctor')
  complete(@Param('id') id: string, @Body() body: { notes: string; diagnosis: string }) {
    return this.consultationsService.complete(id, body.notes, body.diagnosis);
  }

  @Put(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.consultationsService.cancel(id);
  }
}
