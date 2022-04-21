import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Size } from './models/entities/size.entity';
import { Product } from './models/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Size])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
