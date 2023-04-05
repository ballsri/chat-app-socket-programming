import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class UserDto {

    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    constructor(username: string, name: string, password: string) {
        this.username = username;
        this.name = name;
        this.password = password;
    }

}