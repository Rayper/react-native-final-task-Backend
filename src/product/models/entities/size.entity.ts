import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sizes')
export class Size {
  @PrimaryGeneratedColumn()
  sizeId: number;

  @Column()
  name: string;
}
