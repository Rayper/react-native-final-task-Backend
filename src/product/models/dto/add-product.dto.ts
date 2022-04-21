/* eslint-disable prettier/prettier */
import { IsNotEmpty } from "class-validator";

class Sizes {
  @IsNotEmpty()
  name: string;
}

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
  sizes: Sizes[];
}