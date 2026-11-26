import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartService } from './cart.service';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  getCart(@CurrentUser() user: AuthenticatedUser) {
    return this.cart.getCart(user.sub);
  }

  @Post()
  addItem(@CurrentUser() user: AuthenticatedUser, @Body() dto: AddCartItemDto) {
    return this.cart.addItem(user.sub, dto.productId, dto.quantity);
  }

  @Delete(':productId')
  removeItem(@CurrentUser() user: AuthenticatedUser, @Param('productId', ParseMongoIdPipe) productId: string) {
    return this.cart.removeItem(user.sub, productId);
  }

  @Patch(':productId')
  updateItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('productId', ParseMongoIdPipe) productId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cart.updateItem(user.sub, productId, dto.quantity);
  }

  @Delete()
  clear(@CurrentUser() user: AuthenticatedUser) {
    return this.cart.clear(user.sub);
  }
}