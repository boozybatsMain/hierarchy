import { Controller, Get, Render } from '@nestjs/common'
import { UsersService } from './users/users.service'

@Controller()
export class AppController {
    constructor(private readonly usersService: UsersService) {}

    @Render('home')
    @Get()
    public async index() {
        const users = await this.usersService.getAllUsers()
        return { users }
    }
}
