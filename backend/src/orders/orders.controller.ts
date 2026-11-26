import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  create(@Body() dto: CreateOrderDto, @CurrentUser() user?: AuthenticatedUser) {
    return this.orders.create(dto, user?.sub);
  }

  @Get('dashboard')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getDashboardSummary() {
    return this.orders.getDashboardSummary();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return user.role === 'admin'
      ? this.orders.findAll()
      : this.orders.findForUser(user.sub);
  }

  @Patch(':id/status')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateStatus(@Param('id', ParseMongoIdPipe) id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orders.updateStatus(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.orders.remove(id);
  }
}