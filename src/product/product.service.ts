import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { addProductDto } from './models/dto/add-product.dto';
import { Product } from './models/entities/product.entity';
import { Size } from './models/entities/size.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
  ) {}

  async findAllProducts(): Promise<Product[]> {
    return await this.productRepository.find({ relations: ['sizes'] });
  }

  async findAllSizes(): Promise<Size[]> {
    return await this.sizeRepository.find();
  }

  async getProductById(condition, relations = []): Promise<Product> {
    const product = await this.productRepository.findOne(condition, { relations });

    if (!product) {
      throw new NotFoundException('Product is not found!');
    }

    return product;
  }

  async testCreateProducts(): Promise<Product> {
    const product = new Product();

    const size1 = await this.sizeRepository.findOne(1);
    const size2 = await this.sizeRepository.findOne(2);
    const size3 = await this.sizeRepository.findOne(3);
    const size4 = await this.sizeRepository.findOne(4);

    product.name = 'Red Nike Hoodie';
    product.description = 'Nike Hoodie with cool Red Color';
    product.image = '../../assets/images/default_image.jpg';
    product.brand = 'Nike';
    product.price = 650000;
    product.sizes = [size1, size2, size3];

    return await this.productRepository.save(product);
  }

  async addProducts(data): Promise<any> {
    return this.productRepository.save(data);
  }
}
