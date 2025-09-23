export interface PawnshopProfile {
  _id?: string;      // id из MongoDB
  userId: string;    // ObjectId → string
  name: string;
  address: string;
  phone: string;
  logoUrl?: string;
  schedule: string;
  rating?: number;
  description?: string;
  photos?: string[];
  createdAt?: Date;
}
