import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum([
    'new-offer',
    'offer-accepted',
    'offer-rejected',
    'new-message',
    'system',
    'chat-opened',
    'product-sold',
    'price-changed'
  ])
  type: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsOptional()
  refId?: string;
}