import { createContext } from 'react'
import { IUser } from 'types'

export interface UserContextProps {
    users: IUser[]
    deleteUser: (id: number) => Promise<void>
    updateManager: (id: number, managerId: number) => Promise<void>
}

export const UserContext = createContext<UserContextProps>({
    users: [],
    deleteUser: async () => {},
    updateManager: async () => {},
})
