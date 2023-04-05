import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { ResponseDto } from '../dto/response.dto';

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
}