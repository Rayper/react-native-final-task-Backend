import { Product } from 'src/product/models/entities/product.entity';
import { User } from 'src/user/models/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  cartId: number;

  @Column()
  name: string;

  @Column()
  size: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  image: string;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.carts)
  user: User;

  @JoinColumn()
  @ManyToOne(() => Product, (product) => product.carts)
  product: Product;
}
