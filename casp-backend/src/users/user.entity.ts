import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    @Unique(['username'])
    username: string;
    
    @Column()
    password: string;

    @Column()
    name: string;

}