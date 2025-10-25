import { Controller, Get, Param } from '@nestjs/common';
import { SlotService } from './slot.service';

@Controller('slots')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

    

  @Get()
  getAllSlots() {
    return this.slotService.findAll();
  }

  @Get('user/:userId')
  getSlotsByUser(@Param('userId') userId: string) {
    return this.slotService.findByUserId(userId);
  }

  @Get('pawnshop/:pawnshopId')
  getSlotsByPawnshop(@Param('pawnshopId') pawnshopId: string) {
    return this.slotService.findByPawnshopId(pawnshopId);
  }

  @Get(':id')
  getSlotById(@Param('id') id: string) {
    return this.slotService.findById(id);
  }
}
