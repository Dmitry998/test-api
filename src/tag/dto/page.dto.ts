import { ApiProperty } from "@nestjs/swagger";
import { isArray } from "class-validator";
import { GetTagByIdDto } from "./get-tag-by-id.dto";
import { PageMetaDto } from "./page-meta.dto";

export class PageDto<T> {
    @ApiProperty({isArray: true})
    readonly data: T[];

    @ApiProperty({type: () => PageMetaDto})
    readonly meta: PageMetaDto;

    constructor(data: T[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}