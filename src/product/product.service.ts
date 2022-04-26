import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async getProductById(condition: any): Promise<Product> {
    const product = await this.productRepository.findOne(condition, { relations: ['sizes'] });

    if (!product) {
      throw new NotFoundException('Product is not found!');
    }

    return product;
  }

  async testCreateProducts(): Promise<Product> {
    const product = new Product();
    const size1 = await this.sizeRepository.findOne(1);
    const size2 = await this.sizeRepository.findOne(2);

    product.name = 'Test Name';
    product.description = 'Test Decription';
    product.brand = 'Test Brand';
    product.price = 220000;
    product.sizes = [size1, size2];

    return await this.productRepository.save(product);
  }

  async addProducts(data: any): Promise<Product> {
    const product = new Product();

    const size1 = await this.sizeRepository.findOne(1);
    const size2 = await this.sizeRepository.findOne(2);

    product.name = data.name;
    product.description = data.description;
    product.brand = data.brand;
    product.price = data.price;
    product.sizes = [size1, size2];
    // // Promise.all => menunggu semua promise lain yang masih berjalan hingga semuanya selesai
    // product.sizes = await Promise.all(
    //   // search size yang available
    //   data.sizes.map(async (size) => {
    //     const findSize = await this.sizeRepository.findOne({ name: size.name });

    //     if (findSize) {
    //       return findSize;
    //     } else {
    //       throw new NotFoundException('Size is not available');
    //     }
    //   }),
    // );
    return await this.productRepository.save(product);
  }
}
