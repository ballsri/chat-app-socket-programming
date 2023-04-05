import { IsNotEmpty, IsString, MinLength, IsAscii } from '@nestjs/class-validator';


const seed = "1234567890!@#$%^&*ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @IsAscii()
    password: string;

    @IsNotEmpty()
    @IsString()
    confirm_password: string;
}