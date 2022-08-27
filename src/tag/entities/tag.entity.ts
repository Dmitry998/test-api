import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { GetTagDto } from "../dto/get-tag.dto";

@Entity('tag')
export class Tag {

    @ApiProperty({ example: '1', description: 'id' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'Name', description: 'Название тэга' })
    @Column({ length: 40 })
    name: string;

    @ApiProperty({ example: 0, description: 'Сортировка' })
    @Column({
        default: 0
    })
    sortOrder: number

    @ManyToOne(type => User)
    @JoinColumn({ name: 'creator' })
    user: User;

    public convertToGetDto(tag) {
        let dto = new GetTagDto();
    }

}
