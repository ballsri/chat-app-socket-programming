import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class GroupDto {

    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    name: string;


    constructor(name: string) {
        this.name = name;
    }

}