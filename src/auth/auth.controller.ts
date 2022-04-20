import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterDto } from './models/register.dto';
import { LoginDto } from './models/login.dto';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
// passthrough => buat dapetin token dari front-end, passing ke backend
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    if (body.password !== body.password_confirm) {
      throw new BadRequestException('Password do not match!');
    }

    const hashed = await bcrypt.hash(body.password, 12);

    return this.authService.register({
      email: body.email,
      password: hashed,
    });
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) response: Response) {
    // karena nested jadi pakai await
    const user = await this.userService.findOne({ email: body.email });

    // validasi ketika email tidak terdaftar
    if (!user) {
      throw new NotFoundException('Email is not registered!');
    }

    // // compare password yang ada dan password yang diinput
    if (!(await bcrypt.compare(body.password, user.password))) {
      throw new BadRequestException('Wrong Password!');
    }

    // signAsync(payloadnya id)
    const jwt = await this.jwtService.signAsync({ id: user.id });

    response.cookie('jwt', jwt, { httpOnly: true });

    return user;
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async User(@Req() request: Request) {
    const id = await this.authService.userById(request);

    return this.userService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'Success Logout!',
    };
  }
}
