import { Injectable } from '@nestjs/common'
import { User } from './user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { IUser } from 'types'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private dataSource: DataSource
    ) {}

    async getAllUsers(): Promise<User[]> {
        return this.usersRepository.find({
            relations: ['manager', 'employees'],
        })
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        return this.usersRepository.save(createUserDto)
    }

    async findUserById(userId: number): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
        })
        if (user == null) {
            throw new Error(`User not found for userId ${userId}`)
        }
        return user
    }

    async assignManager(
        userId: number,
        managerId: number | null
    ): Promise<User> {
        let user: User

        if (managerId == null) {
            user = await this.findUserById(userId)

            user.manager = null
        } else {
            const result = await Promise.all([
                this.findUserById(userId),
                this.findUserById(managerId),
            ])
            user = result[0]
            const manager = result[1]

            if (manager.manager?.id == userId) {
                throw new Error(
                    `Cyclic manager assignment for userId ${userId}`
                )
            }

            user.manager = manager
        }

        await this.usersRepository.save(user)

        return user
    }

    async deleteUser(userId: number): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner()

        let errMessage: string

        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const user = await queryRunner.manager.findOneOrFail(User, {
                where: { id: userId },
                relations: ['employees'],
            })

            if (user.employees.length > 0) {
                for (const employee of user.employees) {
                    employee.manager = null
                    await queryRunner.manager.save(employee)
                }
            }

            await queryRunner.manager.remove(user)

            await queryRunner.commitTransaction()
        } catch (err) {
            errMessage = err.message
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }

        if (errMessage) {
            throw new Error(errMessage)
        }
    }

    public fillWithAvailableManagers(users: User[]): IUser[] {
        const result: IUser[] = []

        const usersMap = new Map<number, User>()
        users.forEach((user) => usersMap.set(user.id, user))

        users.forEach((user) => {
            result.push({
                ...user,
                availableManagers: users.filter((candidate) =>
                    this.isManagerValid(candidate, user, usersMap)
                ),
            })
        })

        return result
    }

    private isManagerValid(
        candidate: User,
        user: User,
        usersMap: Map<number, User>
    ): boolean {
        if (candidate.id === user.id) {
            return false
        }

        let currentManager = candidate.manager
        while (currentManager) {
            const currentUser = usersMap.get(currentManager.id)

            if (user.id === currentUser.id) {
                return false
            }
            currentManager =
                currentUser.manager == null
                    ? null
                    : usersMap.get(currentUser.manager.id)
        }

        return true
    }
}
