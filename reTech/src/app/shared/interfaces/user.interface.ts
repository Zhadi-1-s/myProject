import { Product } from "./product.interface";

export interface User{
    _id?: string; // из MongoDB
    name:string;
    email: string;
    password: string; // использовать только при логине/регистрации
    role: 'user' | 'pawnshop' | 'admin';
    createdAt?: Date; // добавляется через timestamps
    avatarUrl:string; // profile picture
}