import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product,ProductSchema } from 'src/core/database/schemas/product.schema';

@Module({
    imports:[MongooseModule.forFeature([{name:Product.name, schema:ProductSchema}])],
    providers:[],
    exports:[]
})
export class ProductModule {}