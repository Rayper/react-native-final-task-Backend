import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('sizes')
export class Size {
  @PrimaryGeneratedColumn()
  sizeId: number;

  @Column()
  name: string;

  @ManyToMany(() => Product, (product) => product.sizes)
  products: Product[];
}
