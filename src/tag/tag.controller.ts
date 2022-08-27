import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAuthGuard } from 'src/auth/jwt-suth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { PageOptionsDto } from './dto/page-options.dto';
import { PageDto } from './dto/page.dto';
import { GetTagByIdDto } from './dto/get-tag-by-id.dto';
import { GetTagDto } from './dto/get-tag.dto';

@ApiTags('Тэги')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tag')
export class TagController {
    constructor(private readonly tagService: TagService) { }

    @Post()
    create(@Body() createTagDto: CreateTagDto, @AuthUser() user: User) {
        return this.tagService.create(createTagDto, user.uid);
    }

    @Get()
    @ApiCreatedResponse({
        description: 'Список всех тэгов',
        type: PageDto<GetTagByIdDto>,
    })
    findAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<GetTagByIdDto>> {
        return this.tagService.getAll(pageOptionsDto);
    }

    @Get(':id')
    getById(@Param('id') id: number) {
        return this.tagService.getById(id);
    }

    @Put(':id')
    @ApiOkResponse({
        description: 'Обновление тэга',
        type: GetTagByIdDto,
    })
    change(
        @Body() updateTag: UpdateTagDto,
        @Param('id') id: number,
        @AuthUser() user: User,
    ): Promise<GetTagByIdDto> {
        return this.tagService.change(updateTag, id, user.uid);
    }

    @Delete(':id')
    delete(@Param('id') tagId: number, @AuthUser() user: User){
        return this.tagService.delete(user.uid, tagId);
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    //   return this.tagService.update(+id, updateTagDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.tagService.remove(+id);
    // }
}
