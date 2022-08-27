import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { TokenDto } from './dto/token.dto';
import { User } from 'src/user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from 'bcryptjs';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>,
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

    public async logout(tokenValue: string): Promise<Token> {
        const token = await this.tokenRepository.create({value: tokenValue});
        return await this.tokenRepository.save(token);
    }

    public async checkTokenInBlackList(token: string): Promise<boolean>{
        const verifyToken = await this.tokenRepository.findOneBy({value: token});
        if(!verifyToken){
            return false;
        }
        return true;
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


    // private async checkTokenInBlackList(){
    //     const req = context.switchToHttp().getRequest();
    //     try {
    //         const authHeader = req.headers.authorization;
    //         const bearer = authHeader.split(' ')[0];
    //         const token = authHeader.split(' ')[1];

    //         if (bearer !== 'Bearer' || !token) {
    //             throw new UnauthorizedException({ message: 'Пользователь не авторизован' })
    //         }

    //         const user = this.jwtService.verify(token);
    //         req.user = user;
    //         return true;

    //     } catch (e) {
    //         throw new UnauthorizedException({ message: 'Пользователь не авторизован' })
    //     }
    // }

}
