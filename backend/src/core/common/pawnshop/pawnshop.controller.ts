import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PawnshopService } from './pawnshop.service';
import { CreatePawnshopDto, UpdatePawnshopDto } from './pawnshop.dto';

@Controller('pawnshops')
export class PawnshopController {
  constructor(private readonly pawnshopService: PawnshopService) {}


  @Post()
  create(@Body() createDto: CreatePawnshopDto) {
    return this.pawnshopService.create(createDto);
  }


  @Get()
  findAll() {
    return this.pawnshopService.findAll();
  }

 
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pawnshopService.findOne(id);
  }

 
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdatePawnshopDto) {
    return this.pawnshopService.update(id, updateDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pawnshopService.remove(id);
  }
}
