import { ApiProperty } from "@nestjs/swagger";

export class CreateTagDto {
    @ApiProperty({example: '1', description: 'id'})
    id: number;

    @ApiProperty({example: 'Name', description: 'Название тэга'})
    name: string;

    @ApiProperty({example: 0, description: 'Сортировка'})
    sortOrder: number
}
