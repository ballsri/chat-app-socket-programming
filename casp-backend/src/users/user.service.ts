import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from '../dtos/entities/user.dto';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      return null;
    }
    return user;
  }

  async createUser(userDto: UserDto): Promise<User> {
    const user = new User();
    user.id = uuidv4();
    user.username = userDto.username;
    user.password = userDto.password;
    user.name = userDto.name;

    return await this.userRepository.save(user);
  }

  async updateUser(id: string, userDto: UserDto): Promise<User> {
    const userFound = await this.userRepository.findOneBy({ id: id });
      userFound.password = userDto.password;
      userFound.name = userDto.name;
      return await this.userRepository.save(userFound);
  }

  async editFavorite(id: string, userDto: UserDto): Promise<User> {
    const userFound = await this.userRepository.findOneBy({ id: id });
    userFound.favorite = userDto.favorite;
    return await this.userRepository.save(userFound);
  }
  
  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getUserByUsername(username: string): Promise<User> {
    const userFound = await this.userRepository.findOneBy({
      username: username,
    });
    if (!userFound) {
      return null;
    }

    return userFound;
  }

  async blockUser(from_id: string, to_id: string): Promise<User[]> {
    const fromUser = await this.userRepository.findOneBy({ id: from_id });
    const toUser = await this.userRepository.findOneBy({ id: to_id });
    if(fromUser.block_list.includes(to_id) == false){
      fromUser.block_list.push(to_id)
      toUser.banned_list.push(from_id)
    }
    this.userRepository.save(fromUser)
    this.userRepository.save(toUser)
    const response = [fromUser,toUser];
    return response;
  }

  async unblockUser(from_id: string, to_id: string): Promise<User[]> {
    const fromUser = await this.userRepository.findOneBy({ id: from_id });
    const toUser = await this.userRepository.findOneBy({ id: to_id });
    if(fromUser.block_list.includes(to_id)){
      fromUser.block_list = fromUser.block_list.filter(id => id !== to_id);
      toUser.banned_list = toUser.banned_list.filter(id => id !== from_id);
    }
    this.userRepository.save(fromUser)
    this.userRepository.save(toUser)
    const response = [fromUser,toUser];
    return response;
  }
}
