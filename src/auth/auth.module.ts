import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenBlackList } from './entities/token.entity';
import { TagModule } from 'src/tag/tag.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([TokenBlackList]),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'SECRET'
        }),
        forwardRef(() => UserModule),
        forwardRef(() => TagModule)
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [
        AuthService,
        JwtModule
    ],
})
export class AuthModule { }
