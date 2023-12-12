export interface IUser {
    id: number
    name: string
    manager: ISimpleUser | null
    availableManagers: ISimpleUser[]
}

export interface ISimpleUser {
    id: number
    name: string
}
