export interface Offer{
    _id?: string; // id оффера из MongoDB
    productId: string; // ObjectId → string
    pawnshopId: string; // ObjectId → string
    productOwnerId: string;
    price: number;
    message?: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt?: Date;
}