// pawnshop-profile.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PawnshopProfileDocument = PawnshopProfile & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class PawnshopProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  logoUrl?: string;

  @Prop()
  schedule: string;

  @Prop()
  rating?: number;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  photos?: string[];
}

export const PawnshopProfileSchema = SchemaFactory.createForClass(PawnshopProfile);
