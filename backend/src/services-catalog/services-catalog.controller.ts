import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ServiceDto, UpdateServiceDto } from './services-catalog.dto';
import { ServicesCatalogService } from './services-catalog.service';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@Controller('services')
export class ServicesCatalogController {
  constructor(private readonly services: ServicesCatalogService) {}

  @Get()
  findAll() {
    return this.services.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.services.findOne(slug);
  }

  @Post()
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() dto: ServiceDto) {
    return this.services.create(dto);
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() dto: UpdateServiceDto) {
    return this.services.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.services.remove(id);
  }
}