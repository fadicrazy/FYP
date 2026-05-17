import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('deliveries')
@UseGuards(JwtAuthGuard)
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('pharmacy', 'admin')
  create(@Body() body: any, @Request() req: any) {
    return this.deliveriesService.create({ ...body, pharmacyId: req.user.sub });
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('pharmacy', 'admin', 'nurse')
  findAll(@Query('status') status?: string) {
    const filters: any = {};
    if (status) filters.status = status;
    return this.deliveriesService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveriesService.findById(id);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles('pharmacy', 'admin')
  updateStatus(@Param('id') id: string, @Body() body: { status: string; trackingNotes?: string }) {
    return this.deliveriesService.updateStatus(id, body.status as any, body.trackingNotes);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('pharmacy', 'admin', 'nurse')
  remove(@Param('id') id: string) {
    return this.deliveriesService.remove(id);
  }
}
