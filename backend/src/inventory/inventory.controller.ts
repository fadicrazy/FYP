import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('pharmacy', 'admin')
  getStats() {
    return this.inventoryService.getPharmacyStats();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('pharmacy', 'admin')
  create(@Body() body: any) {
    return this.inventoryService.create(body);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('pharmacy', 'admin')
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('lowStock') lowStock?: string,
  ) {
    return this.inventoryService.findAll({ search, category, lowStock });
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('pharmacy', 'admin')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('pharmacy', 'admin')
  update(@Param('id') id: string, @Body() body: any) {
    return this.inventoryService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('pharmacy', 'admin')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}
