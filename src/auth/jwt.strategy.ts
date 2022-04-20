import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../user/models/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    super({
      ignoreExpiration: false,
      secretOrKey: 'secret123',
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies['auth_cookie'];
        },
      ]),
    });
  }

  async validate(payload: any) {
    if (payload === null) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
