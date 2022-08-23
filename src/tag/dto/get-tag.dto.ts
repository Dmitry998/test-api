import { ApiProperty } from "@nestjs/swagger";
import { Tag } from "../entities/tag.entity";

export class GetTagDto {

    @ApiProperty({example: '1', description: 'id'})
    id: number;

    @ApiProperty({example: 'Name', description: 'Название тэга'})
    name: string;

    @ApiProperty({example: 0, description: 'Сортировка'})
    sortOrder: number

    public convertFromEntity(tag: Tag){
        const dto = new GetTagDto();

        dto.name = tag.name;
        dto.sortOrder = tag.sortOrder;
        dto.id = tag.id;
        return dto;
    }
}