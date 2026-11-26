import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true, maxlength: 120 })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug!: string;

  @Prop({ required: true, trim: true, maxlength: 2000 })
  description!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true, trim: true })
  image!: string;

  @Prop({ required: true, trim: true, maxlength: 60 })
  category!: string;

  @Prop({ default: 0, min: 0 })
  stock!: number;

  @Prop({ default: 5, min: 0, max: 5 })
  rating!: number;

  @Prop({ default: true })
  featured!: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);