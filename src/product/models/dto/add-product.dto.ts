import { IsNotEmpty } from 'class-validator';
import { Size } from '../entities/size.entity';

export class addProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  brand: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  sizes: Size[];
}
