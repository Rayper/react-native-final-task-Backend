import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FavouriteService } from './favourite.service';

@Controller('favourite')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Get('getAllFavourites')
  @UseGuards(AuthGuard('jwt'))
  async getAllFavourites(@Request() req: any): Promise<any> {
    return await this.favouriteService.getAllFavourites(req.user.userId);
  }

  @Post('addFavouritesProduct')
  @UseGuards(AuthGuard('jwt'))
  async addFavouritesProduct(@Request() req: any, @Body() body: any) {
    return await this.favouriteService.addFavouritesProduct(req.user.userId, body);
  }

  @Delete('deleteFavouritesProduct/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteFavouritesProduct(@Param('id', ParseIntPipe) favouriteId: number) {
    return await this.favouriteService.deleteFavouritesProduct(favouriteId);
  }
}
