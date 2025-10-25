export interface Product {
  _id?: string; // id из MongoDB
  ownerId: string; // ObjectId → string
  title: string;
  description?: string;
  category: string;
  photos: string[];
  status: 'open' | 'sold' | 'closed';
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}