import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { Tag } from 'src/tag/entities/tag.entity';
import { UserTagsDto } from './dto/user-tags.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>
        // private readonly authService: AuthService
    ) { }

    public async findAll(): Promise<User[]> {
        const users = this.userRepository.find({ relations: ['tags'] });
        return users;
    }

    public async findUserByUid(uid: string): Promise<User> {
        const user = await this.userRepository.findOne({
            relations: ['tags'],
            where: { uid: uid }
        });

        if (!user) {
            throw new HttpException('Пользователя не существует', HttpStatus.NOT_FOUND);
        }

        return user;
    }

    public async update(updateUserDto: UpdateUserDto, uid: string) {
        const user = await this.userRepository.findOneBy({ uid: uid });
        if (!user) {
            throw new HttpException('Пользователя не существует', HttpStatus.NOT_FOUND);
        }

        let existingUser = await this.findUserByEmail(updateUserDto.email);
        if (existingUser) {
            throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);
        }
        existingUser = await this.findUserByNickname(updateUserDto.nickname);
        if (existingUser) {
            throw new HttpException('Пользователь с таким nickname уже существует', HttpStatus.BAD_REQUEST);
        }

        if (updateUserDto.password) {
            updateUserDto.password = await this.hashPassword(updateUserDto.password);
        }

        const dto: GetUserDto = new GetUserDto();
        return dto.convertFromEntity(await this.userRepository.save({ ...user, ...updateUserDto }));
    }

    public async createUser(createUser: CreateUserDto): Promise<User> {

        createUser.password = await this.hashPassword(createUser.password);

        const user = await this.userRepository.create(createUser);
        return await this.userRepository.save(user);
    }

    public async deleteUser(uid: string, token: string): Promise<void> {
        await this.userRepository.delete({ uid: uid });
        // await this.authService.logout(token);
        //плюс надо разлогинить
    }

    public async findUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ email: email });
        return user;
    }

    public async findUserByNickname(nickname: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ nickname: nickname });
        return user;
    }

    public async addTagsForUser(tags: number[], user: User) {

        const tagEntities: Tag[] = [];

        for (let i = 0; i < tags.length; i++) {
            const tagId = tags[i];
            const tag = await this.tagRepository.findOneBy({ id: tagId });
            if (!tag) {
                throw new HttpException(`Тэга с id=${tagId} не существует`, HttpStatus.BAD_REQUEST);
            }
            tagEntities.push(tag);
        }

        let userEntity = await this.userRepository.findOne({ relations: ['tags'], where: { uid: user.uid } });
        for (let i = 0; i < tagEntities.length; i++) {
            userEntity.tags.push(tagEntities[i]);
        }
        userEntity = await this.userRepository.save(userEntity);

        const dto = new UserTagsDto(userEntity.tags);
        return dto;
    }

    public async deleteUserTag(tagId: number, user: User) {
        const userEntity = await this.userRepository.findOne({ relations: ['tags'], where: { uid: user.uid } });
        const resultTags = userEntity.tags.filter(t => t.id != tagId);

        console.log(resultTags);
        userEntity.tags = resultTags;
        await this.userRepository.save(userEntity);
        const dto = new UserTagsDto(userEntity.tags);
        return dto;
    }

    public async getTagsWhereUserIsCreator(user: User) {

        const queryBuilder = this.tagRepository.createQueryBuilder('tag');
        queryBuilder.where('tag.user=:creator', { creator: user.uid });
        const { entities } = await queryBuilder.getRawAndEntities();
        const dto = new UserTagsDto(entities);
        return dto;
    }

    private async hashPassword(password: string, salt = 5): Promise<string> {
        const hashPassword = await bcryptjs.hash(password, salt);
        return hashPassword;
    }
}
