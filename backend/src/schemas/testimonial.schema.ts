import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TestimonialDocument = HydratedDocument<Testimonial>;

@Schema({ timestamps: true })
export class Testimonial {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  role!: string;

  @Prop({ required: true, maxlength: 1200 })
  quote!: string;

  @Prop({ required: true })
  image!: string;

  @Prop({ default: 5, min: 1, max: 5 })
  rating!: number;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);