import { IsNotEmpty, IsString, IsDateString, IsUUID } from '@nestjs/class-validator';

export class MessageDto {

    @IsUUID()
    id: string;

    @IsString()
    text: string;

    @IsDateString()
    sent_at: string;

    @IsString()
    user_id: string;


    @IsNotEmpty()
    @IsString()
    name: string;

    constructor( id: string, text: string, sent_at: string, user_id: string, name: string) {
        this.id = id;
        this.text = text;
        this.sent_at = sent_at;
        this.user_id = user_id;
        this.name = name;
    }

}