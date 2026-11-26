import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CartItem, CartItemDocument } from '../schemas/cart-item.schema';
import { Product, ProductDocument } from '../schemas/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartItem.name) private readonly items: Model<CartItemDocument>,
    @InjectModel(Product.name) private readonly products: Model<ProductDocument>,
  ) {}

  async getCart(userId: string) {
    const items = await this.items.find({ userId }).populate('productId').lean();
    return items.filter((item) => item.productId);
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await this.products.findById(productId);
    if (!product) throw new NotFoundException('Product not found');
    const existing = await this.items.findOne({ userId, productId });
    const nextQuantity = (existing?.quantity ?? 0) + quantity;
    if (nextQuantity > product.stock || nextQuantity > 50) {
      throw new BadRequestException('The requested quantity is not available');
    }
    return this.items.findOneAndUpdate(
      { userId: new Types.ObjectId(userId), productId: new Types.ObjectId(productId) },
      { $set: { quantity: nextQuantity } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    ).populate('productId');
  }

  async removeItem(userId: string, productId: string) {
    await this.items.deleteOne({ userId, productId });
    return this.getCart(userId);
  }

  async updateItem(userId: string, productId: string, quantity: number) {
    const [cartItem, product] = await Promise.all([
      this.items.findOne({ userId, productId }),
      this.products.findById(productId),
    ]);
    if (!cartItem) throw new NotFoundException('Cart item not found');
    if (!product) throw new NotFoundException('Product not found');
    if (quantity > product.stock) {
      throw new BadRequestException('The requested quantity is not available');
    }
    const item = await this.items.findOneAndUpdate(
      { userId, productId },
      { quantity },
      { new: true, runValidators: true },
    ).populate('productId');
    return item;
  }

  async clear(userId: string) {
    await this.items.deleteMany({ userId });
    return { message: 'Cart cleared' };
  }
}