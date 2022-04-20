import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
// import { request, Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './models/register.dto';

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

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() request) {
    return {
      userId: request.user.id,
      email: request.user.email,
      token: this.authService.getTokenForUser(request.user),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  async User(@Req() request) {
    return request.user;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response) {
    response.clearCookie('jwt');
    return {
      message: 'Success Logout!',
    };
  }
}
