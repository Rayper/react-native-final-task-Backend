import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('getUserCart')
  @UseGuards(AuthGuard('jwt'))
  async getUserCart(@Request() req: any): Promise<any> {
    return await this.cartService.getUserCart(req.user.userId);
  }
}
