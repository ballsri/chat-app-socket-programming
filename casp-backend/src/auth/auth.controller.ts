import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dtos/login.dto';
import { ResponseDto } from '../dtos/response.dto';
import { RegisterDto } from '../dtos/register.dto';

import { validate } from '@nestjs/class-validator';
import { BadRequestException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        try {
            
            let token = await this.authService.login(loginDto);

            if (token)
                return new ResponseDto(
                    true,
                    "Login Successful",
                    token
                )

            else return new ResponseDto(
                false,
                "Login Failed",
                null
            );
        } catch (error) {
            return new ResponseDto(
                false,
                error.message,
                null
            );

        }
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        try {
            let user = await this.authService.register(registerDto);
            if (user)
                return new ResponseDto(
                    true,
                    "Registration Successful",
                    user
                )

            else return new ResponseDto(
                false,
                "Registration Failed",
                null
            );
        } catch (error) {
            return new ResponseDto(
                false,
                error.message,
                null
            );

        }
    }
}