import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-local';
import { User } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({ usernameField: 'email' });
  }

  public async validate(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      email,
    });

    if (!user) {
      throw new BadRequestException(`User ${email} is not found!`);
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException(`Invalid Credentials for ${email}!`);
    }

    return user;
  }
}
