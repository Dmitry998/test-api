import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {

    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
        // private readonly userService: UserService
    ) { }


    async create(createTagDto: CreateTagDto, uidCreator: string) {
        const tag = await this.tagRepository.create(createTagDto);
        // const user = await this.userService.findUserByUid(uidCreator);

        // tag.user = user;
        return tag;
    }

    findAll() {
        return `This action returns all tag`;
    }

    findOne(id: number) {
        return `This action returns a #${id} tag`;
    }

    update(id: number, updateTagDto: UpdateTagDto) {
        return `This action updates a #${id} tag`;
    }

    remove(id: number) {
        return `This action removes a #${id} tag`;
    }
}
