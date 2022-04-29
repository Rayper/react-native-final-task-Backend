import { Exclude, Expose } from 'class-transformer';
import { Favourite } from 'src/favourite/models/favourite.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Expose()
  get fullname(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Column({ unique: true })
  email: string;

  @Column({ default: '' })
  address: string;

  @Column()
  @Exclude()
  password: string;

  @ManyToOne(() => Favourite, (favourite) => favourite.user, { cascade: true })
  favourites: Favourite[];
}
