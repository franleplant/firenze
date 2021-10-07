import {Entity, Column, Timestamp, PrimaryColumn} from "typeorm";

@Entity()
export class Follow {

    @PrimaryColumn()
    id: number;

    @Column()
    fromUser: string;

    @Column()
    toUser: string;

    @Column()
    timestamp: Timestamp;

}
