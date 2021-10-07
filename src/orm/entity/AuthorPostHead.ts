import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class AuthorPostHead {

    @PrimaryColumn()
    author: string;

    @Column()
    post: string;
}
