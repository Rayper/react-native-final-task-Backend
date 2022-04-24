import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  @Exclude()
  password: string;
}
