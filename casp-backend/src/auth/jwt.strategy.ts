import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '../users/user.service';
import { config} from 'dotenv';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
    config();
  }

  async validate(payload: any) {
    const user = await this.userService.getUserByUsername(payload.username);
    if (!user) {
      return null;
    }

    return user;
    }   
}
