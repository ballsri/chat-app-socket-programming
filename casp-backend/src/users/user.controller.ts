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

    @Put('/block/:from_id/:to_id')
    async blockUser(@Param() params) {
        try {
            let response = await this.userService.blockUser(params.from_id, params.to_id);

            return new ResponseDto(
                true,
                "Block user Successful",
                response
            )

        } catch (error) {
            return new ResponseDto(
                false,
                error.message,
                null
            );

        }
    }

    @Put('/unblock/:from_id/:to_id')
    async unblockUser(@Param() params) {
        try {
            let response = await this.userService.unblockUser(params.from_id, params.to_id);

            return new ResponseDto(
                true,
                "Unblock user Successful",
                response
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