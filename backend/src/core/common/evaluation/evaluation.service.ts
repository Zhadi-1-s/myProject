import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Evaluation } from 'src/core/database/schemas/evaluation.schema';
import { CreateEvaluationDto } from './evaluation.dto';
import { UpdateEvaluationStatusDto } from './evaluation.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectModel(Evaluation.name)
    private evaluationModel: Model<Evaluation>,
    private notificationService: NotificationService,
  ) {}

  async create(dto: CreateEvaluationDto): Promise<Evaluation> {
    const evaluation = new this.evaluationModel(dto);

    await this.notificationService.create({
        userId: dto.pawnshopId,
        type:'new-offer',
        title:'New evaluation request',
        message:`You have a new evaluation request for product ${dto.title}`,
        refId: evaluation._id?.toString(),
        isRead:false
    })

    return evaluation.save();
  }

  async getByPawnshop(pawnshopId: string): Promise<Evaluation[]> {
    return this.evaluationModel.find({ pawnshopId }).sort({ createdAt: -1 });
  }

  async getByUser(userId: string): Promise<Evaluation[]> {
    return this.evaluationModel.find({ userId }).sort({ createdAt: -1 });
  }

  async getById(id: string): Promise<Evaluation> {
    const evalFound = await this.evaluationModel.findById(id);
    if (!evalFound) throw new NotFoundException('Evaluation not found');
    return evalFound;
  }

  async updateStatus(id: string, dto: UpdateEvaluationStatusDto): Promise<Evaluation> {
    const updated = await this.evaluationModel.findByIdAndUpdate(
      id,
      { status: dto.status },
      { new: true },
    );
    if (!updated) throw new NotFoundException('Evaluation not found');
    return updated;
  }
}
