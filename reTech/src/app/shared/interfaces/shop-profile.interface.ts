import { Slot } from "./slot.interface";

export interface PawnshopProfile {
  _id?: string;      // id из MongoDB
  userId: string   // ObjectId → string
  name: string;
  address: string;
  phone: string;
  logoUrl?: string;
  openTime: string;  //  "09:00"
  closeTime: string; //  "18:00"
  scheduleDays?: string[]; //  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  rating?: number;
  description?: string;
  photos?: string[];
  activeSlots:Slot[];
  slotLimit:number;
  createdAt?: Date;
}
