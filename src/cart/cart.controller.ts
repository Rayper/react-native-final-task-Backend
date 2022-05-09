import { Body, ClassSerializerInterceptor, Controller, Get, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartService } from './cart.service';
import { AddToCartDto } from './models/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('getUserCart')
  @UseGuards(AuthGuard('jwt'))
  async getUserCart(@Request() req: any): Promise<any> {
    return await this.cartService.getUserCart(req.user.userId);
  }

  @Post('addToCart')
  @UseGuards(AuthGuard('jwt'))
  async addToCart(@Request() req: any, @Body() body: AddToCartDto) {
    return await this.cartService.addToCart(req.user.userId, body);
  }
}
