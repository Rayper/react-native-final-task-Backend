import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { addProductDto } from './models/dto/add-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('findAllProducts')
  async findAllProducts() {
    return await this.productService.findAllProducts();
  }

  @Get('findAllSizes')
  async findAllSizes() {
    return await this.productService.findAllSizes();
  }

  @Post('testCreateProducts')
  async testCreateProduct() {
    return await this.productService.testCreateProducts();
  }

  @Get('details/:productId')
  async get(@Param('productId') productId: number) {
    return this.productService.getProductById({ productId }, ['sizes']);
  }

  // masih failed
  @Post('addProduct')
  async addProduct(@Body() body: addProductDto, @Body('sizes') ids: number[]) {
    return await this.productService.addProducts({
      ...body,
      sizes: ids.map((sizeId) => ({ sizeId })),
    });
  }
}
