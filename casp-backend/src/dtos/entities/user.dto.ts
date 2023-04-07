import { IsNotEmpty, IsString, IsUUID } from '@nestjs/class-validator';

export class UserDto {

    @IsUUID()
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

    constructor(username: string, password: string, name: string,) {
        this.username = username;
        this.password = password;
        this.name = name;
    }

}