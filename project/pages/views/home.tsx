import * as React from 'react'
import { NextPage, NextPageContext } from 'next'
import { IUser } from '../../types'
import UserTree from '../../components/UserTree/UserTree'
import { deleteUser, getAllUsers, updateManager } from '../../utils/api'
import { UserContext } from '../../contexts/user.context'
import { CreateUser } from '../../components/CreateUser/CreateUser'

interface Props {
    query: { users?: IUser[] }
}

const home: NextPage<Props> = ({ query }) => {
    const [users, setUsers] = React.useState<IUser[]>([])

    React.useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = React.useCallback(async () => {
        getAllUsers().then((result) => {
            setUsers(result)
        })
    }, [])

    const onDeleteUser = React.useCallback(async (id: number) => {
        deleteUser(id).then(() => {
            fetchUsers()
        })
    }, [])

    const onUpdateManager = React.useCallback(
        async (id: number, managerId: number) => {
            updateManager(id, managerId).then(() => {
                fetchUsers()
            })
        },
        []
    )

    return (
        <UserContext.Provider
            value={{
                users,
                deleteUser: onDeleteUser,
                updateManager: onUpdateManager,
            }}
        >
            <CreateUser onCreate={fetchUsers} />
            <UserTree />
        </UserContext.Provider>
    )
}

export async function getServerSideProps(ctx: NextPageContext) {
    return {
        props: {
            query: {
                users: [] as IUser[],
            },
        },
    }
}

export default home
