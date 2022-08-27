import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { Token } from 'src/auth/entities/token.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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

        if(!user){
            throw new HttpException('Пользователя не существует', HttpStatus.NOT_FOUND);
        }

        return user;
    }

    public async update(updateUserDto: UpdateUserDto, uid: string){
        const user = await this.userRepository.findOneBy({uid: uid});
        if(!user){
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

        if(updateUserDto.password){
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

    private async hashPassword(password: string, salt=5): Promise<string> {
        const hashPassword = await bcryptjs.hash(password, salt);
        return hashPassword;
    }
}
