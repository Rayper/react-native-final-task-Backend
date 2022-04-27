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

  async loginWithToken(body): Promise<{ user: User; token: string }> {
    const user = await this.userService.findOne({ email: body.email });

    if (!user) {
      throw new NotFoundException('Email is not registered!');
    }

    if (!(await bcrypt.compare(body.password, user.password))) {
      throw new BadRequestException('Wrong Password!');
    }

    const token = this.userToken(user);

    return {
      user: user,
      token: token,
    };
  }

  public userToken(user: User): string {
    return this.jwtService.sign({
      email: user.email,
      sub: user.userId,
    });
  }
}
