import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../user/models/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    const cookieExtractor = (req: any) => {
      let jwt = null;

      if (req && req.cookies) {
        jwt = req.cookies['auth_cookie'];
      }

      return jwt;
    };

    super({
      ignoreExpiration: false,
      secretOrKey: 'secret123',
      jwtFromRequest: cookieExtractor,
    });
  }

  async validate(payload: any) {
    if (payload === null) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
