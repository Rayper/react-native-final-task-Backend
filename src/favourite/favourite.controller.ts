import { Controller, Get, Request, UseGuards } from '@nestjs/common';
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
}
