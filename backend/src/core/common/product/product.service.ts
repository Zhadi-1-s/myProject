import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product,ProductDocument } from 'src/core/database/schemas/product.schema';
import { CreateProductDto } from './product.dto';
import { UpdateProductDto } from './update-product.dto';


@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel({
      ...dto,
      ownerId: new Types.ObjectId(dto.ownerId),
      photos: dto.photos?.length ? dto.photos : ['assets/png/iphone-11.jpg','assets/png/ip.jpg','assets/png/ip2.jpg','assets/png/ip3.jpg','assets/png/ip4.jpg'], // ✅ дефолтное значение
    });
    return createdProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().populate('ownerId', 'name email').exec();
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate('ownerId', 'name email').exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    if (dto.ownerId) {
      dto.ownerId = new Types.ObjectId(dto.ownerId) as any; // 👈 если передан ownerId
    }
    const updated = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  async delete(id: string): Promise<{ message: string }> {
    const res = await this.productModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Product not found');
    return { message: 'Product deleted successfully' };
  }

  async findByOwner(ownerId: string): Promise<Product[]> {
    return this.productModel.find({ ownerId: new Types.ObjectId(ownerId) }).exec();
  }
}
