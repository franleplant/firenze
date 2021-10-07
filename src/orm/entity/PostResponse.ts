import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class PostResponse {
    
    @PrimaryColumn()
    fromPost: string;

    @Column()
    toPost: string;

}
