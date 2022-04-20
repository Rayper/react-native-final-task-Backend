import { BadRequestException, Body, Injectable, NotFoundException, Res } from '@nestjs/common';
import { User } from 'src/user/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { LoginDto } from './models/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(body): Promise<User> {
    const existEmail = await this.userService.findOne({
      email: body.email,
    });

    if (existEmail) {
      throw new BadRequestException('Email already exist!');
    }

    if (body.password !== body.password_confirm) {
      throw new BadRequestException('Password do not match!');
    }

    const hashed = await bcrypt.hash(body.password, 12);

    return this.userService.create({
      email: body.email,
      password: hashed,
    });
  }

  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<User> {
    const user = await this.userService.findOne({ email: body.email });

    if (!user) {
      throw new NotFoundException('Email is not registered!');
    }

    if (!(await bcrypt.compare(body.password, user.password))) {
      throw new BadRequestException('Wrong Password!');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('auth_cookie', jwt, { httpOnly: true });

    return user;
  }

  async myProfile(request: Request): Promise<number> {
    const cookie = request.cookies['auth_cookie'];

    const data = await this.jwtService.verifyAsync(cookie);

    return data['id'];
  }
}
