import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(condition): Promise<User> {
    return this.userRepository.findOne(condition);
  }

  async create(data): Promise<User> {
    return this.userRepository.save(data);
  }

  async updatePersonalInfo(userId: number, body: any): Promise<User> {
    const { ...data } = body;
    let updatedData = body;

    updatedData = {
      ...data,
    };

    await this.userRepository.update(userId, updatedData);

    return this.findOne({ userId });
  }

  async updatePassword(userId: number, body: any): Promise<User> {
    const { password, confirmpassword } = body;
    let updatedData = body;

    if (password) {
      if (password !== confirmpassword) {
        throw new BadRequestException('Password do not match!');
      }
      const hashed = await bcrypt.hash(password, 12);

      updatedData = {
        password: hashed,
      };
    }

    await this.userRepository.update(userId, updatedData);

    return this.findOne({ userId });
  }
}
