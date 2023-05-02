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

<<<<<<< HEAD
    @Column({ type: 'simple-array', nullable: true })
    block_list: string[];

    @Column({ type: 'simple-array', nullable: true })
    banned_list: string[];
=======
    @Column("text", { array: true , default: []})
    favorite: string[];
>>>>>>> favorite

}