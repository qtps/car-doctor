import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Service, ServiceDocument } from '../schemas/service.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orders: Model<OrderDocument>,
    @InjectModel(Product.name) private readonly products: Model<ProductDocument>,
    @InjectModel(Service.name) private readonly services: Model<ServiceDocument>,
  ) {}

  async create(dto: CreateOrderDto, userId?: string) {
    const lines = await Promise.all(dto.items.map(async (item) => {
      if (item.serviceId) {
        const service = await this.services.findById(item.serviceId);
        if (!service || !service.active) throw new NotFoundException('Selected service is unavailable');
        return {
          serviceId: service._id,
          itemType: 'service' as const,
          name: service.name,
          price: service.price,
          quantity: item.quantity,
          image: service.image,
        };
      }
      if (!item.productId) throw new NotFoundException('Order item was not found');
      const product = await this.products.findById(item.productId);
      if (!product) throw new NotFoundException('Selected product is unavailable');
      if (item.quantity > product.stock) {
        throw new BadRequestException(`${product.name} does not have enough stock for this order`);
      }
      return {
        productId: product._id,
        itemType: 'product' as const,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      };
    }));

    return this.orders.create({
      ...dto,
      email: dto.email.toLowerCase().trim(),
      userId: userId ? new Types.ObjectId(userId) : null,
      items: lines,
      total: lines.reduce((total, item) => total + item.price * item.quantity, 0),
    });
  }

  findForUser(userId: string) {
    return this.orders.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  findAll() {
    return this.orders.find().sort({ createdAt: -1 }).lean();
  }

  async getDashboardSummary() {
    const [orderCounts, revenue, productCount, pendingOrders] = await Promise.all([
      this.orders.aggregate<{ _id: string; count: number }>([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.orders.aggregate<{ total: number }>([
        { $match: { status: { $in: ['approved', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      this.products.countDocuments(),
      this.orders.countDocuments({ status: 'pending' }),
    ]);
    return {
      orders: orderCounts.reduce((sum, item) => sum + item.count, 0),
      pendingOrders,
      revenue: revenue[0]?.total ?? 0,
      products: productCount,
    };
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.orders.findByIdAndUpdate(id, { status: dto.status }, { new: true });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async remove(id: string) {
    if (!(await this.orders.findByIdAndDelete(id))) throw new NotFoundException('Order not found');
    return { message: 'Order deleted' };
  }
}