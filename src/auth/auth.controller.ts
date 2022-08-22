import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response, response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ValidationUser } from 'src/user/pipes/validation-user.pipe';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Авторизация/регистрация')
@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UsePipes(ValidationUser)
    @Post('signin')
    signin(@Body() createUserDto: CreateUserDto) {
        return this.authService.signin(createUserDto);
    }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('logout')
    logout(@Res() response: Response) {
        return this.authService.logout(response);
    }
}
