import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { Group } from './group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from './group.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Group])],
    providers: [GroupService],
    controllers: [GroupController],
    exports: [GroupService],
})
export class GroupModule { }
