import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Token]),
        forwardRef(() => UserModule),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'SECRET'
        })
    ],
    exports: [
        AuthService,
        JwtModule
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule { }
