import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/models/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async register(body): Promise<User> {
    if (body.password !== body.password_confirm) {
      throw new BadRequestException('Password do not match!');
    }

    const hashed = await bcrypt.hash(body.password, 12);

    return this.userService.create({
      email: body.email,
      password: hashed,
    });
  }

  async login(body): Promise<User> {
    // karena nested jadi pakai await
    const user = await this.userService.login({ email: body.email });

    // validasi ketika email tidak terdaftar
    if (!user) {
      throw new NotFoundException('Email is not registered!');
    }

    // compare password yang ada dan password yang diinput
    if (!(await bcrypt.compare(body.password, user.password))) {
      throw new BadRequestException('Wrong Password!');
    }

    return user;
  }
}
