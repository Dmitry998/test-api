import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
// import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { GetTagByIdDto } from './dto/get-tag-by-id.dto';
import { GetTagDto } from './dto/get-tag.dto';
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

    async getAll(sortByOrder, sortByName, offset, length){
        console.log(sortByOrder);
        console.log(sortByName);
        console.log(offset);
        console.log(length);
    }


    async nameIsTaken(name: string): Promise<void> {
        const tag = await this.tagRepository.findOneBy({ name: name });

        if (tag) {
            throw new HttpException(`Имя: ${name} уже занято`, HttpStatus.BAD_REQUEST);
        }
    }


    async findAll(): Promise<Tag[]> {
        return await this.tagRepository.find();
    }

    // findOne(id: number) {
    //     return `This action returns a #${id} tag`;
    // }

    // update(id: number, updateTagDto: UpdateTagDto) {
    //     return `This action updates a #${id} tag`;
    // }

    // remove(id: number) {
    //     return `This action removes a #${id} tag`;
    // }
}
