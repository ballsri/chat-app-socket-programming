import { Controller, Post, Get, Body } from '@nestjs/common';

import { ResponseDto } from '../dtos/response.dto';
import { GroupService } from './group.service';
import { GroupDto } from '../dtos/entities/group.dto';


@Controller('api/v1/groups')
export class GroupController {
    constructor(private groupService: GroupService) { }

    @Get('')
    async getAll() {
        try {

            let groups = await this.groupService.getAllGroups();


            return new ResponseDto(
                true,
                "Get all groups Successful",
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

    @Post('/create')
    async createGroup(@Body() data: any) {
        let groupDto = new GroupDto( data.name);

        try {
            let group = await this.groupService.createGroup(groupDto);

            return new ResponseDto(
                true,
                "Create group Successful",
                group
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