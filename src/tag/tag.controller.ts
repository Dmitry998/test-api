import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAuthGuard } from 'src/auth/jwt-suth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';

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
    findAll(
        @Query('sortByOrder') sortByOrder,
        @Query('sortByName') sortByName,
        @Query('offset') offset: number,
        @Query('length') length: number,

    ) {
      return this.tagService.getAll(sortByOrder, sortByName, offset, length);
    }

    @Get(':id')
    getById(@Param('id') id: number) {
      return this.tagService.getById(id);
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
