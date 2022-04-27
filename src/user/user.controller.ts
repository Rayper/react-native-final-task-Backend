import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePasswordDto } from './models/dto/updatePassword.dto';
import { updatePersonalInfoDto } from './models/dto/updatePersonalInfo';
import { User } from './models/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Patch('updatePersonalInfo')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  async updatePersonalInfo(@Request() req: any, @Body() body: updatePersonalInfoDto) {
    this.userService.updatePersonalInfo(req.user.userId, body);

    return {
      message: 'Update Personal Info Success!',
      updatedData: body,
    };
  }

  @Patch('updatePassword')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  async updatePassword(@Request() req: any, @Body() body: UpdatePasswordDto) {
    this.userService.updatePassword(req.user.userId, body);

    return {
      message: 'Your Password has been Changed!',
    };
  }
}
