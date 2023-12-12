import React from 'react'
import { createUser } from 'utils/api'

interface Props {
    onCreate: () => void
}

export const CreateUser: React.FC<Props> = ({ onCreate }) => {
    const [name, setName] = React.useState<string>('')

    const updateName = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value)
        },
        []
    )

    const onClick = React.useCallback(() => {
        createUser(name).then(() => {
            onCreate()
            setName('')
        })
    }, [name])

    return (
        <div>
            <span>Создайте пользователя</span>
            <br />
            <input
                type="text"
                placeholder="Имя пользователя"
                value={name}
                onChange={updateName}
            />
            <button onClick={onClick}>Создать</button>
        </div>
    )
}
