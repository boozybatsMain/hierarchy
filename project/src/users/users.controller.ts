import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAllUsers() {
        const users = await this.usersService.getAllUsers()

        return this.usersService.fillWithAvailableManagers(users)
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto)
    }

    @Put(':id')
    async assignManager(
        @Param('id') userId: number,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.usersService.assignManager(userId, updateUserDto.managerId)
    }

    @Delete(':id')
    async deleteUser(@Param('id') userId: number) {
        return this.usersService.deleteUser(userId)
    }
}
