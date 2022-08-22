import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({example: 'mail@mail.com', description: 'Email'})
    email: string;

    @ApiProperty({example: 'Password123', description: 'Пароль'})
    password: string;

    @ApiProperty({example: 'Nagasadoy', description: 'Никнейм'})
    nickname: string;
}
