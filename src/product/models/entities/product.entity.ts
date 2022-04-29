import { Favourite } from 'src/favourite/models/favourite.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Size } from './size.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column()
  name: string;

  @Column({ default: 'default_image.jpg' })
  image: string;

  @Column()
  brand: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @ManyToMany(() => Size, { cascade: true })
  @JoinTable({
    name: 'mapping_product_sizes',
    joinColumn: { name: 'productId', referencedColumnName: 'productId' },
    inverseJoinColumn: { name: 'sizeId', referencedColumnName: 'sizeId' },
  })
  sizes: Size[];

  @ManyToOne(() => Favourite, (favourite) => favourite.product, { cascade: true })
  favourites: Favourite[];
}
