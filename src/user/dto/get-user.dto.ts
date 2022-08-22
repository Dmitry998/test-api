import { ApiProperty } from "@nestjs/swagger";
import { Tag } from "src/tag/entities/tag.entity";
import { User } from "../entities/user.entity";

export class GetUserDto {
    @ApiProperty({example: 'mail@mail.com', description: 'Email'})
    email: string;

    @ApiProperty({example: 'Password123', description: 'Пароль'})
    password: string;

    @ApiProperty({example: 'Nagasadoy', description: 'Никнейм'})
    nickname: string;

    @ApiProperty({example: '[]', description: 'Тэги'})
    tags: Tag[];

    public convertFromEntity(user: User){
        const dto = new GetUserDto();

        dto.email = user.email;
        dto.nickname = user.nickname;
        dto.tags = user.tags;
        return dto;
    }
}