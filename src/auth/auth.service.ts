import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';

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

    if (body.password !== body.confirmpassword) {
      throw new BadRequestException('Password do not match!');
    }

    const hashed = await bcrypt.hash(body.password, 12);

    return this.userService.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: hashed,
    });
  }

  async loginWithCookie(body, response): Promise<User> {
    const user = await this.userService.findOne({ email: body.email });

    if (!user) {
      throw new NotFoundException('Email is not registered!');
    }

    if (!(await bcrypt.compare(body.password, user.password))) {
      throw new BadRequestException('Wrong Password!');
    }

    const jwt = await this.jwtService.signAsync({ id: user.userId });

    response.cookie('auth_cookie', jwt, { httpOnly: true });

    return user;
  }

  async userId(request): Promise<number> {
    const cookie = request.cookies['auth_cookie'];

    const data = await this.jwtService.verifyAsync(cookie);

    return data['id'];
  }

  async updateProfile(userId: number, body): Promise<User> {
    const { ...data } = body;

    await this.userService.update(userId, {
      ...data,
    });

    return this.userService.findOne({ userId });
  }

  async updateInfo(request, body) {
    const userId = await this.userId(request);

    await this.userService.update(userId, body);

    return this.userService.findOne({ userId });
  }

  async updatePassword(request, password, confirmpassword) {
    if (password !== confirmpassword) {
      throw new BadRequestException('Password do not match!');
    }

    const userId = await this.userId(request);

    const hashed = await bcrypt.hash(password, 12);

    await this.userService.update(userId, {
      password: hashed,
    });

    return this.userService.findOne({ userId });
  }
}
