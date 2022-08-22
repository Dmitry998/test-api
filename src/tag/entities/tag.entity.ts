import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('tag')
export class Tag {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 40 })
    name: string;

    @Column({
        default: 0
    })
    sortOrder: number

    @ManyToOne(type => User)
    @JoinColumn({ name: 'creator' })
    user: User;
}
