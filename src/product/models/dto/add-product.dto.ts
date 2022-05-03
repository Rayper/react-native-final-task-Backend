import { IsNotEmpty } from 'class-validator';

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
  sizes: number[];
}
