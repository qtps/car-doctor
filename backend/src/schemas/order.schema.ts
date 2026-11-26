import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderLine {
  @Prop({ type: Types.ObjectId, ref: 'Product', default: null })
  productId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Service', default: null })
  serviceId?: Types.ObjectId | null;

  @Prop({ enum: ['product', 'service'], default: 'product' })
  itemType!: 'product' | 'service';

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true, min: 1 })
  quantity!: number;

  @Prop({ required: true })
  image!: string;
}

export const OrderLineSchema = SchemaFactory.createForClass(OrderLine);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId?: Types.ObjectId | null;

  @Prop({ required: true, trim: true, maxlength: 80 })
  firstName!: string;

  @Prop({ required: true, trim: true, maxlength: 80 })
  lastName!: string;

  @Prop({ required: true, lowercase: true, trim: true, maxlength: 254 })
  email!: string;

  @Prop({ required: true, trim: true, maxlength: 30 })
  phone!: string;

  @Prop({ trim: true, maxlength: 1200, default: '' })
  message!: string;

  @Prop({ required: true, type: [OrderLineSchema] })
  items!: OrderLine[];

  @Prop({ required: true, min: 0 })
  total!: number;

  @Prop({ enum: ['pending', 'approved', 'completed', 'cancelled'], default: 'pending' })
  status!: 'pending' | 'approved' | 'completed' | 'cancelled';
}

export const OrderSchema = SchemaFactory.createForClass(Order);