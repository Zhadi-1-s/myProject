import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/core/database/schemas/user.schema';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findOne(query: any): Promise<UserDocument | null> {
    return this.userModel.findOne(query).select('+password');
  }

  async create(user: any): Promise<UserDocument> {
    this.logger.log('Creating user.');
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findOneAndUpdate(query: any, payload: any): Promise<UserDocument | null> {
    this.logger.log('Updating User.');
    return this.userModel.findOneAndUpdate(query, payload, {
      new: true,
      upsert: true,
    });
  }

  async findOneAndDelete(query: any): Promise<UserDocument | null> {
    this.logger.log('Deleting user.');
    return this.userModel.findOneAndDelete(query);
  }
}
