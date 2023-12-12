import { Controller, Get, Render } from '@nestjs/common'

@Controller()
export class AppController {
    @Render('home')
    @Get()
    public async index() {
        return {}
    }
}
