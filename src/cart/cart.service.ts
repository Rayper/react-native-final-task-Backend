import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddToCartDto } from './models/add-to-cart.dto';
import { Cart } from './models/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartService: Repository<Cart>,
  ) {}

  async getUserCart(userId: number): Promise<Cart[]> {
    return await this.cartService.find({
      where: { user: { userId: userId } },
      relations: ['user', 'product'],
    });
  }

  async addToCart(userId: number, body: AddToCartDto): Promise<Cart> {
    return await this.cartService.save({
      product: {
        productId: body.productId,
      },
      user: {
        userId: userId,
      },
      name: body.name,
      size: body.size,
      quantity: body.quantity,
      price: body.price,
      image: body.image,
    });
  }
}
