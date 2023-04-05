import { ConsoleLogger, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { NotFoundException } from '@nestjs/common';
import { LoginDto } from 'src/dtos/login.dto';
import { RegisterDto } from 'src/dtos/register.dto';
import { UserDto } from 'src/dtos/entities/user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        try {
            const user = await this.usersService.getUserByUsername(username);
            if (user.password === pass) {
                const { password, ...result } = user;
                return result;
            }
            throw new NotFoundException(`Password is incorrect`);
        } catch (error) {
            throw error;
        }


    }

    async getJWT(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            token: this.jwtService.sign(payload),
        };
    }

    async login(loginDto: LoginDto) {
        try {

            const user = await this.validateUser(loginDto.username, loginDto.password);
            if (user) {
                return this.getJWT(user);
            }
            throw new NotFoundException(`User not found`);
        } catch (error) {
            throw error;
        }

    }

    async register(registerDto: RegisterDto) {
        try {
            const userDto = new UserDto(registerDto.username, registerDto.password, registerDto.name);
            
            let user = await this.usersService.createUser(userDto);
            if (user)
                return user;

            else return null;
        } catch (error) {
            throw error;

        }
    }
}