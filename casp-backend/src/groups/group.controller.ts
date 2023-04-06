import { Controller, Post, Get, Body } from '@nestjs/common';

import { ResponseDto } from '../dtos/response.dto';
import { GroupService } from './group.service';


import { validate } from '@nestjs/class-validator';
import { BadRequestException } from '@nestjs/common';

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

}