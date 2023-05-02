/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Body, Param, Put } from '@nestjs/common';

import { ResponseDto } from '../dtos/response.dto';
import { UserService } from './user.service';
import { UserDto } from '../dtos/entities/user.dto';

@Controller('api/v1/users')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('')
    async getAll() {
        try {

            let groups = await this.userService.getAllUsers();
            console.log(groups);


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

    @Post('/edit/:id')
    async editUser(@Body() data: any, @Param() params) {
        let userDto = new UserDto(data.username, data.password, data.name);

        try {
            let user = await this.userService.updateUser(params.id, userDto);

            return new ResponseDto(
                true,
                "Edit user Successful",
                user
            )

        } catch (error) {
            return new ResponseDto(
                false,
                error.message,
                null
            );

        }
    }

    @Put('/edit/:id/favorite')
    async editFavorite(@Body() data: any, @Param() params) {
        let userDto = await this.userService.getUserById(params.id);
        userDto.favorite = data.favorite;
        console.log(userDto);

        try {
            let user = await this.userService.editFavorite(params.id, userDto);

            return new ResponseDto(
                true,
                "Edit user's favorite Successful",
                user
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