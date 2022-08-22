import { ApiProperty } from "@nestjs/swagger";
import { Tag } from "src/tag/entities/tag.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User {

    @ApiProperty({example: 'Password123', description: 'UUID'})
    @PrimaryGeneratedColumn("uuid")
    uid: string;

    @ApiProperty({example: 'mail@mail.com', description: 'Email'})
    @Column({ length: 100, comment: 'Email' })
    email: string;

    @ApiProperty({example: 'Password123', description: 'Пароль'})
    @Column({ length: 100, comment: 'Пароль' })
    password: string;

    @ApiProperty({example: 'Nagasadoy', description: 'Никнейм'})
    @Column({ length: 30, comment: 'Никнейм' })
    nickname: string;

    @ManyToMany(() => Tag)
    @JoinTable()
    tags: Tag[]
}
