import { Injectable } from '@nestjs/common';
import { User } from 'src/user/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(data): Promise<User> {
    return this.userRepository.save(data);
  }

  async login(body, response): Promise<User> {
    return this.userRepository.findOne(body, response);
  }

  async userById(request: Request): Promise<number> {
    const cookie = request.cookies['jwt'];

    const data = await this.jwtService.verifyAsync(cookie);

    return data['id'];
  }
}
