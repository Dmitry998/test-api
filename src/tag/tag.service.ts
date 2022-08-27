import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
// import { UserService } from 'src/user/user.service';
import { DeleteResult, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { GetTagByIdDto } from './dto/get-tag-by-id.dto';
import { GetTagDto } from './dto/get-tag.dto';
import { PageMetaDto } from './dto/page-meta.dto';
import { PageOptionsDto } from './dto/page-options.dto';
import { PageDto } from './dto/page.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {

    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
        private readonly userService: UserService
    ) { }


    async create(createTagDto: CreateTagDto, uidCreator: string): Promise<GetTagDto> {

        await this.nameIsTaken(createTagDto.name);

        let tag = await this.tagRepository.create(createTagDto);
        const user = await this.userService.findUserByUid(uidCreator);
        tag.user = user;
        tag = await this.tagRepository.save(tag);

        const dto = new GetTagDto();
        return dto.convertFromEntity(tag);
    }


    async getById(id: number): Promise<GetTagByIdDto> {
        const tag = await this.tagRepository.findOne({
            relations: ['user'],
            where: { id: id }
        });
        if (!tag) {
            throw new HttpException(`По id=${id} тэг не найден`, HttpStatus.NOT_FOUND);
        }

        const dto = new GetTagByIdDto();
        return dto.convertFromEntity(tag);
    }

    async getAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<GetTagByIdDto>> {

        const skip = (pageOptionsDto.page - 1) * pageOptionsDto.pageSize;
        const queryBuilder = this.tagRepository.createQueryBuilder('tag');


        queryBuilder
            .innerJoinAndSelect('tag.user', 'user.uid')
            .orderBy("tag.name", pageOptionsDto.sortByName)
            .addOrderBy("tag.sortOrder", pageOptionsDto.sortByOrder)
            .skip(skip)
            .take(pageOptionsDto.pageSize);

        console.log(queryBuilder.getQuery());

        const totalCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();

        const pageMetaDto = new PageMetaDto({
            page: pageOptionsDto.page,
            pageSize: pageOptionsDto.pageSize,
            quantity: totalCount
        });

        const dtoTags: GetTagByIdDto[] = entities.map(el => {
            const dto = new GetTagByIdDto();
            return dto.convertFromEntity(el);
        })

        return new PageDto(dtoTags, pageMetaDto);
    }

    async change(updateTag: UpdateTagDto, tagId: number, uidCreator: string): Promise<GetTagByIdDto> {

        let tag = await this.tagRepository.findOne({
            relations: ['user'],
            where: { id: tagId }
        });

        await this.userIsCreator(uidCreator, tag.user.uid);

        if (tag.name != updateTag.name) {
            await this.nameIsTaken(updateTag.name);
        }

        tag.name = updateTag.name;
        tag.sortOrder = updateTag.sortOrder;

        tag = await this.tagRepository.save(tag)
        const dto = new GetTagByIdDto();
        return dto.convertFromEntity(tag);
    }

    async delete(creatorId: string, tagId: number): Promise<boolean> {
        let tag = await this.tagRepository.findOne({
            relations: ['user'],
            where: { id: tagId }
        });

        await this.userIsCreator(creatorId, tag.user.uid);

        await this.tagRepository.delete(tagId);

        // const user = this.userRepository.findOne({
        //     relations: [],
        //     where:
        // })

        return true;
    }

    async userIsCreator(uidCreator: string, uidTag: string){
        if (uidCreator != uidTag) {
            throw new HttpException(`Только создатель может изменять или удалять тэг`, HttpStatus.BAD_REQUEST);
        }

    }

    async nameIsTaken(name: string): Promise<void> {
        const tag = await this.tagRepository.findOneBy({ name: name });

        if (tag) {
            throw new HttpException(`Имя: ${name} уже занято`, HttpStatus.BAD_REQUEST);
        }
    }
}
