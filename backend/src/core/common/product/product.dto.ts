import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum, IsMongoId, isString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: '6707f9a3c52f1a2b6b2f1d1c', description: 'ID владельца (User._id) или (PawnShopId)' })
  @IsMongoId()
  ownerId: string;

  @ApiProperty({ example: 'iPhone 13 Pro', description: 'Название продукта' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Телефон в хорошем состоянии', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Electronics', description: 'Категория товара' })
  @IsString()
  category: string;

  @ApiProperty({
    example: ['https://example.com/photo1.jpg'],
    required: false,
    description: 'Фото товара',
  })
  @IsOptional()
  @IsArray()
  photos?: string[];

  @ApiProperty({ enum: ['open', 'sold', 'closed'], default: 'open' })
  @IsOptional()
  @IsEnum(['open', 'sold', 'closed'])
  status?: 'open' | 'sold' | 'closed';

  @ApiProperty({example:'1000 тг',required:true})
  @IsString()
  price:number;
}
