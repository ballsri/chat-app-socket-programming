import { Controller, Post, Get, Body } from '@nestjs/common';

import { ResponseDto } from '../dtos/response.dto';
import { UserService } from './user.service';

@Controller('api/v1/users')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('')
    async getAll() {
        try {

            let groups = await this.userService.getAllUsers();


            return new ResponseDto(
                true,
                "Get all users Successful",
                groups
            )


        } catch (error) {
            return new ResponseDto(
                false,
                error.message,
                null
            );

        }
    }

}