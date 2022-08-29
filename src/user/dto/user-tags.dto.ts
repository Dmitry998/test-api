import { ApiProperty } from "@nestjs/swagger";
import { GetTagDto } from "src/tag/dto/get-tag.dto";

export class UserTagsDto {
    @ApiProperty()
    tags: GetTagDto[];

    constructor(tags){
        this.tags = tags;
    }
}