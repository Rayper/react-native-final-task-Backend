import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favourite } from './models/favourite.entity';

@Injectable()
export class FavouriteService {
  constructor(
    @InjectRepository(Favourite)
    private readonly favouriteRepository: Repository<Favourite>,
  ) {}

  async getAllFavourites(userId: number): Promise<any> {
    return await this.favouriteRepository.find({
      where: { user: { userId: userId } },
      relations: ['product'],
    });
  }
}
