import {Entity, PrimaryColumn, Column, Timestamp} from "typeorm";

@Entity()
export class AuthorProfile {

    @PrimaryColumn()
    author: string;

    @Column()
    profile: string;

    @Column()
    timestamp: Timestamp;

    @Column()
    isDeleted: boolean;

}
