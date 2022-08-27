import { Body, Controller, Post, Res, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response, response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ValidationUser } from 'src/user/pipes/validation-user.pipe';
import { Auth } from './auth.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-suth.guard';

@ApiTags('Авторизация/регистрация')
@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UsePipes(ValidationUser)
    @ApiOperation({ summary: 'Регистрация' })
    @ApiCreatedResponse({
        description: 'Пользователь зарегистрирован',
        type: CreateUserDto,
    })
    @Post('signin')
    signin(@Body() createUserDto: CreateUserDto) {
        return this.authService.signin(createUserDto);
    }

    @ApiOperation({ summary: 'Авторизация' })
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @ApiOperation({ summary: 'Выход' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout(@Auth() token) {
        return this.authService.logout(token);
    }
}
