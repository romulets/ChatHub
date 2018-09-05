

const LOCAL_STORAGE_TOKEN = 'access_token'

export function setToken(token) {
    localStorage.setItem(LOCAL_STORAGE_TOKEN, token)
}

export function getToken() {
    return localStorage.getItem(LOCAL_STORAGE_TOKEN)
}

export function hasToken() {
    return getToken() !== null
}

export function removeToken() {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN)
}