import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LoginDto } from './models/login.dto';
import { UserService } from 'src/user/user.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@UseInterceptors(ClassSerializerInterceptor)
// passthrough => buat dapetin token dari front-end, passing ke backend
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) response: Response) {
    return await this.authService.loginWithCookie(body, response);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('myProfile')
  async User(@Req() request: Request) {
    const userId = await this.authService.myProfile(request);

    return this.userService.findOne({ userId });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Res({ passthrough: true }) response) {
    response.clearCookie('auth_cookie');
    return {
      message: 'Success Logout!',
    };
  }
}
