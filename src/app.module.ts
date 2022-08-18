import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { Tag } from './tag/entities/tag.entity';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                return {
                    type: 'postgres',
                    host: process.env.POSTGRES_HOST,
                    username: process.env.POSTGRES_USER,
                    password: `${process.env.POSTGRESS_PASSWORD}`,
                    database: process.env.POSTGRES_DB,
                    port: Number(process.env.POSTGRESS_PORT),
                    entities: [User, Tag],
                    autoLoadEntities: true,
                    logging: true,
                    synchronize: true
                }
            },
        }),
        UserModule,
        TagModule,
        AuthModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
