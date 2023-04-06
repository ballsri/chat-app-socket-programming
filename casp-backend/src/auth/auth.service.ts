import { ConsoleLogger, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { HttpException } from '@nestjs/common';
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

        const user = await this.usersService.getUserByUsername(username);
        if (!user) {
            throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
        }

        if (user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        throw new HttpException(`Password is incorrect`, HttpStatus.BAD_REQUEST);



    }

    async getJWT(user: any) {
        const payload = { username: user.username, id: user.id, name: user.name };
        return {
            token: this.jwtService.sign(payload),
        };
    }

    async login(loginDto: LoginDto) {

        const user = await this.validateUser(loginDto.username, loginDto.password);
        if (user) {
            return this.getJWT(user);
        }
        throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);


    }

    async register(registerDto: RegisterDto) {


        // validate password and confirmpassword
        if (registerDto.password !== registerDto.confirm_password) {
            return new HttpException(`Password and Confirm Password do not match`, HttpStatus.BAD_REQUEST);
        }

        const userDto = new UserDto(registerDto.username, registerDto.password, registerDto.name);

        // validate if user already exists
        const userExists = await this.usersService.getUserByUsername(userDto.username);
        if (userExists) {
            return new HttpException(`User already exists`, HttpStatus.BAD_REQUEST);
        }

        let user = await this.usersService.createUser(userDto);
        if (user)
            return user;

        else return null;
    }
}