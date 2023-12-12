export const getAllUsers = async () => {
    const result = await fetch('/users')
    return result.json()
}

export const deleteUser = async (id: number) => {
    await fetch(`/users/${id}`, { method: 'DELETE' })
}

export const updateManager = async (id: number, managerId: number) => {
    const result = await fetch(`/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ managerId }),
    })
    return result.json()
}

export const createUser = async (name: string) => {
    const result = await fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    })
    return result.json()
}
