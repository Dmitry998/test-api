import { ApiProperty } from "@nestjs/swagger";
import { Tag } from "../entities/tag.entity";

export class GetTagByIdDto {

    @ApiProperty({example: 'Name', description: 'Название тэга'})
    name: string;

    @ApiProperty({example: 0, description: 'Сортировка'})
    sortOrder: number

    @ApiProperty({description: 'Создатель'})
    creator: {
        nickname: string,
        uid: string
    }

    public convertFromEntity(tag: Tag){
        const dto = new GetTagByIdDto();

        dto.name = tag.name;
        dto.sortOrder = tag.sortOrder;
        dto.creator = {
            nickname: tag.user.nickname,
            uid: tag.user.uid
        }
        return dto;
    }
}