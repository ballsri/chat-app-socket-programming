import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';
import { GroupDto } from '../dtos/entities/group.dto';
import { v4 as uuidv4 } from 'uuid';


export class GroupService{
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  

  async getAllGroups(): Promise<Group[]> {
    return await this.groupRepository.find();
  }

  async getGroupById(id: string): Promise<Group> {
    const group = await this.groupRepository.findOneBy({ id: id });
    if (!group) {
      return null;
    }
    return group;
  }

  async createGroup(groupDto: GroupDto): Promise<Group> {
      const group = new Group();
      group.id = uuidv4();
    group.name = groupDto.name;

    return await this.groupRepository.save(group);
  }

  async updateGroup(id: string, groupDto: GroupDto): Promise<Group> {
    const groupFound = await this.groupRepository.findOneBy({ id: id });
    groupFound.name = groupDto.name;

    return await this.groupRepository.save(groupFound);
  }

  async deleteGroup(id: string): Promise<void> {
    await this.groupRepository.delete(id);
  }

  async getUserByName(name: string): Promise<Group> {
    const groupFound = await this.groupRepository.findOneBy({ name: name });
    if (!groupFound) {
      return null;
    }

    return groupFound;
  }
}
