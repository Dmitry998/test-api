import { ApiProperty } from "@nestjs/swagger";

export class AddTagForUserDto {
    @ApiProperty({example: [1,2], description: 'Список id тэгов'})
    tags: number[];
}