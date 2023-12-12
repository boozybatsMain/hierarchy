import React from 'react'
import { IUser } from '../../types'
import UsersTree from 'components/UserTree/UserTree'
import styles from './styles.module.css'

interface Props {
    user: IUser
    onUpdate: (id: number, managerId: number) => void
    onDelete: (id: number) => void
}

const UserView: React.FC<Props> = ({ user, onUpdate, onDelete }) => {
    const onSelect = React.useCallback((id: number) => {
        onUpdate(user.id, id)
    }, [])

    return (
        <div>
            <div className={styles.UserView}>
                <p>{user.name}</p>
                <label className={styles.label}>
                    <span>менеджер</span>
                    <select
                        onChange={(e) => onSelect(Number(e.target.value))}
                        value={user.manager?.id || null}
                    >
                        <option value={null}>Не выбран</option>
                        {user.availableManagers.map((manager) => (
                            <option key={manager.id} value={manager.id}>
                                id {manager.id}: {manager.name}
                            </option>
                        ))}
                    </select>
                </label>
                <button onClick={() => onDelete(user.id)}>Удалить</button>
            </div>
            <UsersTree manager={user} />
        </div>
    )
}

export default UserView
