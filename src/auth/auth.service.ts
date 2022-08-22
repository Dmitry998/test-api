import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { TokenDto } from './dto/token.dto';
import { User } from 'src/user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    public async signin(userDto: CreateUserDto) {
        let candidate = await this.userService.findUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);
        }
        candidate = await this.userService.findUserByNickname(userDto.nickname);
        if (candidate) {
            throw new HttpException('Пользователь с таким nickname уже существует', HttpStatus.BAD_REQUEST);
        }
        const user = await this.userService.createUser({ ...userDto, password: userDto.password });
        return this.generateToken(user);
    }

    public async login(loginDto: LoginDto) {
        const user = await this.userService.findUserByNickname(loginDto.nickname);
        if(!user){
            throw new HttpException('Пользователь с таким nickname не существует', HttpStatus.NOT_FOUND);
        }
        const isMatch = await bcryptjs.compare(loginDto.password, user.password);
        if(!isMatch){
            throw new HttpException('Неправильный пароль!', HttpStatus.NOT_FOUND);
        }
        return this.generateToken(user);
    }

    public async logout(): Promise<void> {
    }


    private async generateToken(user: User) {
        const paylaod = { email: user.email, uid: user.uid, nickname: user.nickname }
        const tokenLifeTime = 1800;

        const tokenDto: TokenDto = {
            token: this.jwtService.sign(paylaod, { expiresIn: tokenLifeTime }),
            expire: tokenLifeTime
        }
        return tokenDto;
    }

}
