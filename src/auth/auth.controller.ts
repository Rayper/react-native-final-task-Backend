import { BadRequestException, Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './models/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './models/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    if (body.password !== body.password_confirm) {
      throw new BadRequestException('Password do not match!');
    }

    const hashed = await bcrypt.hash(body.password, 12);

    return this.userService.create({
      email: body.email,
      password: hashed,
    });
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
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
