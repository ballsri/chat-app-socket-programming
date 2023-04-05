import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({where: {id: id}});
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    async createUser(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    async updateUser(id: string, user: User): Promise<User> {
        const userFound = await this.userRepository.findOneBy({id:id});
        userFound.username = user.username;
        userFound.password = user.password;
        return await this.userRepository.save(userFound);
    }

    async deleteUser(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }

    async getUserByUsername(username: string): Promise<User> {
        const userFound = await this.userRepository.findOneBy({username: username});
        if (!userFound) {
            throw new NotFoundException(`User with username ${username} not found`);
        }
        return userFound;
    }


}

