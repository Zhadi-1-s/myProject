import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class CreatePawnshopDto {

  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({example:'ExtraLombard'})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({example:'Tole bi 59'})
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({example:'8 777 644 2004'})
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({example: 'assets/img/logo.png'})
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({example:'9:00'})
  @IsOptional()
  @IsString()
  openTime?: string;

  @ApiProperty({example:'19:00'})
  @IsOptional()
  @IsString()
  closeTime?: string;

  @ApiProperty({example:'[Monda,Tue,Wed,Thu,Fri]'})
  @IsOptional()
  @IsArray()
  workingDays?: string[];

  @ApiProperty({example:'4.8'})
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiProperty({example:'Good shop with many devices'})
  @IsOptional()
  @IsString()
  description?: string;


  @ApiProperty({example:'[src/img/photo1, photo2]'})
  @IsOptional()
  @IsArray()
  photos?: string[];
}

export class UpdatePawnshopDto extends CreatePawnshopDto {}
