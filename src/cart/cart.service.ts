import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
