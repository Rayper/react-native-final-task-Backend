import { Product } from 'src/product/models/entities/product.entity';
import { User } from 'src/user/models/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Favourite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favourites)
  user: User;

  @ManyToOne(() => Product, (product) => product.favourites)
  product: Product;
}
