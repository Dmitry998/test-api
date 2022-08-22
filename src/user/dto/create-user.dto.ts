import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({example: 'mail@mail.com', description: 'Email'})
    email: string;

    @ApiProperty({example: 'Password123', description: 'Пароль'})
    password: string;

    @ApiProperty({example: 'Nagasadoy', description: 'Никнейм'})
    nickname: string;
}
