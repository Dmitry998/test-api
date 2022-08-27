import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn,ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('token')
export class Token {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    value: string;
}
