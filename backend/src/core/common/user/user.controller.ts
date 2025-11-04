import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Patch(':userId/favorites/:pawnshopId')
  @ApiOperation({ summary: 'Добавить магазин в избранное пользователя' })
  @ApiParam({ name: 'userId', description: 'ID пользователя', type: String })
  @ApiParam({ name: 'pawnshopId', description: 'ID ломбарда (магазина)', type: String })
  async addFavorite(
    @Param('userId') userId: string,
    @Param('pawnshopId') pawnshopId: string,
  ) {
    this.logger.log(`Добавление pawnshop ${pawnshopId} в избранное пользователя ${userId}`);
    const user = await this.userService.addFavorite(userId, pawnshopId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Delete(':userId/favorites/:pawnshopId')
  @ApiOperation({ summary: 'Удалить магазин из избранного пользователя' })
  @ApiParam({ name: 'userId', description: 'ID пользователя', type: String })
  @ApiParam({ name: 'pawnshopId', description: 'ID ломбарда (магазина)', type: String })
  async removeFavorite(
    @Param('userId') userId: string,
    @Param('pawnshopId') pawnshopId: string,
  ) {
    this.logger.log(`Удаление pawnshop ${pawnshopId} из избранного пользователя ${userId}`);
    const user = await this.userService.removeFavorite(userId, pawnshopId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get(':userId/favorites')
  @ApiOperation({ summary: 'Получить все избранные магазины пользователя' })
  @ApiParam({ name: 'userId', description: 'ID пользователя', type: String })
  async getFavorites(@Param('userId') userId: string) {
    this.logger.log(`Получение списка избранных магазинов пользователя ${userId}`);
    const user = await this.userService.getFavorites(userId);
    if (!user) throw new NotFoundException('User not found');
    return user.favoritePawnshops; // можно вернуть только массив избранных
  }
}
