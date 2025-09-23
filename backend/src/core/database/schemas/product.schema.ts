// product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: [String], default: [] })
  photos: string[];

  @Prop({ required: true, enum: ['open', 'sold', 'closed'], default: 'open' })
  status: 'open' | 'sold' | 'closed';
}
export const ProductSchema = SchemaFactory.createForClass(Product);
