

const LOCAL_STORAGE_USER = 'chathub_user'

export function setUser(user) {
    localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(user))
}

export function getUser() {
    const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER))
    return user
}

export function hasUser() {
    return getUser() !== null
}

export function removeUser() {
    localStorage.removeItem(LOCAL_STORAGE_USER)
}