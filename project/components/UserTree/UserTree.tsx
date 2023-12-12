import React, { useState, useEffect, useMemo, useCallback } from 'react'
import UserView from '../UserView/UserView'
import { IUser } from '../../types'
import styles from './styles.module.css'
import { UserContext } from 'contexts/user.context'

interface Props {
    manager?: IUser
}

const UsersTree: React.FC<Props> = ({ manager }) => {
    const { deleteUser, updateManager, users } = React.useContext(UserContext)

    const filteredUsers: IUser[] = useMemo(
        () => users.filter((user) => user.manager?.id == manager?.id),
        [users, manager]
    )

    return (
        <div className={styles.Container}>
            {filteredUsers.map((user) => (
                <UserView
                    key={user.id}
                    user={user}
                    onDelete={deleteUser}
                    onUpdate={updateManager}
                />
            ))}
        </div>
    )
}

export default UsersTree
