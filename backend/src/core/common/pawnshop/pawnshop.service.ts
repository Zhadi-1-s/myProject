import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PawnshopProfile } from 'src/core/database/schemas/shopProfile.schema';
import { CreatePawnshopDto,UpdatePawnshopDto } from './pawnshop.dto';

@Injectable()
export class PawnshopService {
  constructor(
    @InjectModel(PawnshopProfile.name)
    private pawnshopModel: Model<PawnshopProfile>,
  ) {}


  async create(createDto: CreatePawnshopDto): Promise<PawnshopProfile> {
    const defaultRating = 5.0;
    const defaultLogo = 'assets/png/pawnshopLogo.jpg';
    const defaultPhotos = ['assets/img/home-page1.jpg', 'assets/img/home.jpg'];

    const pawnShopData = { 
      ...createDto,
      logoUrl:defaultLogo,
      photos:defaultPhotos,
      rating:defaultRating
    }

    const pawnshop = new this.pawnshopModel(pawnShopData);
    return pawnshop.save();
  }

  async findAll(): Promise<PawnshopProfile[]> {
    return this.pawnshopModel.find().populate('userId', '-password').exec();
  }

  async findOne(id: string): Promise<PawnshopProfile> {
    const pawnshop = await this.pawnshopModel.findById(id).populate('userId', '-password').exec();
    if (!pawnshop) {
      throw new NotFoundException(`Pawnshop with id ${id} not found`);
    }
    return pawnshop;
  }

  async findByUserId(userId: string): Promise<PawnshopProfile | null> {
    return this.pawnshopModel.findOne({ userId }).exec();
  }

  async update(id: string, updateDto: UpdatePawnshopDto): Promise<PawnshopProfile> {
    const pawnshop = await this.pawnshopModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!pawnshop) {
      throw new NotFoundException(`Pawnshop with id ${id} not found`);
    }
    return pawnshop;
  }

  async remove(id: string): Promise<void> {
    const result = await this.pawnshopModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Pawnshop with id ${id} not found`);
    }
  }
}
