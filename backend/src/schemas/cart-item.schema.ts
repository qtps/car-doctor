import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CartItemDocument = HydratedDocument<CartItem>;

@Schema({ timestamps: true })
export class CartItem {
  @Prop({ required: true, index: true, type: Types.ObjectId, ref: 'User' })
  userId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  productId!: Types.ObjectId;

  @Prop({ required: true, min: 1, default: 1 })
  quantity!: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
CartItemSchema.index({ userId: 1, productId: 1 }, { unique: true });