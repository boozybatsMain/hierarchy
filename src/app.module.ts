import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { RenderModule } from 'nest-next'
import Next from 'next'
import { AppController } from './app.controller'
import { UsersService } from './users/users.service'
import { User } from './users/user.entity'

@Module({
    imports: [
        RenderModule.forRootAsync(
            Next({
                dev: process.env.NODE_ENV !== 'production',
                conf: { useFilesystemPublicRoutes: false },
                dir: '.',
            })
        ),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: '127.0.0.1',
            port: 5432,
            username: 'admin',
            password: 'admin',
            database: 'db',
            synchronize: true,
            logging: false,
            autoLoadEntities: true,
        }),
        TypeOrmModule.forFeature([User]),
        UsersModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
