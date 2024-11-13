import {makeServerURL} from "../utils/function.js";

export const loginRequest = async (data) => {
    return await fetch(`${makeServerURL('/auth/login')}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
    });
}

export const logoutRequest = async () => {
    return await fetch(`${makeServerURL('/auth/logout')}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
}

export const registerRequest = async (data) => {
    return await fetch(`${makeServerURL('/auth/register')}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
}

export const existEmail = async (email) => {
    return await fetch(`${makeServerURL('/auth/emails/exist', {'email': email})}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const existNickname = async (nickname) => {
    return await fetch(`${makeServerURL('/auth/nicknames/exist', {'nickname': nickname})}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}