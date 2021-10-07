import {Entity, PrimaryGeneratedColumn, Column, Timestamp} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    post: string;

    @Column()
    liker: string;

    @Column()
    timestamp: Timestamp;

}
