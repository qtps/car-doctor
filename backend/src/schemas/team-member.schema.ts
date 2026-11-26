import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TeamMemberDocument = HydratedDocument<TeamMember>;

@Schema({ timestamps: true })
export class TeamMember {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  role!: string;

  @Prop({ required: true })
  image!: string;

  @Prop({ default: 0 })
  order!: number;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);