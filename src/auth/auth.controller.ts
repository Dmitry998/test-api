import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Авторизация/регистрация')
@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signin')
    signin(@Body() createUserDto: CreateUserDto) {
        return this.authService.signin(createUserDto);
    }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('logout')
    logout() {
        return this.authService.logout();
    }
}
