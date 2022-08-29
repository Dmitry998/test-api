import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Put, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-suth.guard';
import { AuthUser } from './user.decorator';
import { ValidationUser } from './pipes/validation-user.pipe'; 
import { GetUserDto } from './dto/get-user.dto';
import { Auth } from 'src/auth/auth.decorator';
import { AddTagForUserDto } from './dto/add-tag-for-user.dto';

@ApiTags('Пользователи')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    // @ApiOperation({ summary: 'Создание нового пользователя' })
    // @ApiResponse({ status: HttpStatus.CREATED, type: User })
    // @Post()
    // create(@Body() createUserDto: CreateUserDto) {
    //     return this.userService.createUser(createUserDto);
    // }


    @ApiOperation({ summary: 'Получение авторизованного пользователя' })
    @Get()
    async findOne(@AuthUser() user: User) {
        const findUser = await this.userService.findUserByUid(user.uid)
        const dto = new GetUserDto();
        return dto.convertFromEntity(findUser);
    }

    @UsePipes(ValidationUser)
    @ApiOperation({ summary: 'Обновление авторизованного пользователя' })
    @Put()
    update(@Body() updateUser: UpdateUserDto, @AuthUser() authUser: User) {
        return this.userService.update(updateUser, authUser.uid);
    }

    @Delete()
    @ApiOperation({ summary: 'Удаление авторизованного пользователя' })
    delete(@AuthUser() user: User, @Auth() token){
        return this.userService.deleteUser(user.uid, token);
    }

    @Post('/tag')
    @ApiOperation({ summary: 'Добавление новых тэгов для пользователя' })
    addTagsForUser(@AuthUser() user: User, @Body() dto: AddTagForUserDto){
        return this.userService.addTagsForUser(dto.tags, user);
    }

    @Delete('/tag/:id')
    @ApiOperation({ summary: 'Удаление тэга пользователя' })
    deleteUserTag(@AuthUser() user: User, @Param('id') id: number){
        return this.userService.deleteUserTag(id, user);
    }

    @Get('tag/my')
    @ApiOperation({ summary: 'Получение тэгов пользователя' })
    getTagsWhereUserIsCreator(@AuthUser() user: User){
        return this.userService.getTagsWhereUserIsCreator(user);
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //   return this.userService.update(+id, updateUserDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.userService.remove(+id);
    // }
}
