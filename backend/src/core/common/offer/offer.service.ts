import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Offer,OfferDocument } from 'src/core/database/schemas/offer.schema';
import { Model, Types } from 'mongoose';
import { CreateOfferDto } from './offer.dto';
import { UpdateOfferStatusDto } from './update-offer.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class OfferService {
  constructor(
    @InjectModel(Offer.name)
    private offerModel: Model<OfferDocument>,
    private notificationService:NotificationService
  ) {}

  // Создать оффер
  async create(dto: CreateOfferDto) {
    const offer = await this.offerModel.create(dto);

    await this.notificationService.create({
      userId: dto.productOwnerId, // кому отправляем уведомление
      type: 'new-offer',
      title: 'New offer received',
      message: `Someone offered $${dto.price} on your product.`,
      refId: offer._id?.toString(),
      isRead:false
    });

    return offer;

  }

  // Получить офферы по productId
  async getOffersByProduct(productId: string) {
    return this.offerModel.find({ productId }).sort({ createdAt: -1 }).exec();
  }

  // Получить офферы конкретного ломбарда
  async getOffersByPawnshop(pawnshopId: string) {
    return this.offerModel.find({ pawnshopId }).sort({ createdAt: -1 }).exec();
  }

  // Получить один оффер
  async getById(id: string) {
    const offer = await this.offerModel.findById(id);
    if (!offer) throw new NotFoundException('Offer not found');
    return offer;
  }

  // Обновить статус (accept / reject)
  async updateStatus(id: string, dto: UpdateOfferStatusDto) {
    return this.offerModel.findByIdAndUpdate(id, { status: dto.status }, { new: true });
  }
}
