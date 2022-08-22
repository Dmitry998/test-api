import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Length, Matches, MinLength } from "class-validator";

export class CreateUserDto {
    
    @IsEmail({}, {message:'Некорректный email'})
    @ApiProperty({example: 'mail@mail.com', description: 'Email'})
    email: string;

    @MinLength(8, {message:'Пароль должен быть минимум 8 символов'})
    @Matches(
        /^(?=.*[a-zа-я])(?=.*[A-ZА-Я])(?=.*\d)[a-zа-яA-ZА-Я\d]{8,}$/, 
        {message: 'Пароль должен содержать как минимум одну цифру, одну заглавную и одну строчную буквы.'}
    )
    @ApiProperty({example: 'Password123', description: 'Пароль'})
    password: string;

    @ApiProperty({example: 'Nagasadoy', description: 'Никнейм'})
    nickname: string;
}
