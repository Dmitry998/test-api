import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({example: 'Nagasadoy', description: 'Никнейм'})
    nickname: string;
    @ApiProperty({example: 'Password123', description: 'Пароль'})
    password: string;
}