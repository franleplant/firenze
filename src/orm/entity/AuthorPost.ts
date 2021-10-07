import {Entity, PrimaryGeneratedColumn, Column, Timestamp, PrimaryColumn} from "typeorm";

@Entity()
export class AuthorPost {

    @Column()
    author: string;
    
    @PrimaryColumn()
    post: string;

    @Column()
    timestamp: Timestamp;

    @Column()
    isDeleted: boolean;

}
