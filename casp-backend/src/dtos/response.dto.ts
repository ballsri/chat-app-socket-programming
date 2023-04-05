import { IsBoolean, IsNotEmpty, IsString } from '@nestjs/class-validator';

export class ResponseDto {
    @IsNotEmpty()
    @IsBoolean()
    success: boolean;

    @IsNotEmpty()
    @IsString()
    message: string;

    @IsNotEmpty()
    data: any

    constructor(success: boolean, message: string, data: any) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

}