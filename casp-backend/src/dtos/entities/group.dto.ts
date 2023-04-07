import { IsNotEmpty, IsString, IsUUID } from '@nestjs/class-validator';

export class GroupDto {

    @IsUUID()
    id: string;

    @IsNotEmpty()
    @IsString()
    name: string;


    constructor(name: string) {
        this.name = name;
    }

}