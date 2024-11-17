import {makeServerURL} from "../utils/function.js";

export const uploadProfileImage = async (data) => {
    return await fetch(`${makeServerURL('/users/profile-image')}`, {
       method: 'POST',
       body: data,
       credentials: 'include'
    });
}

export const getMyProfile = async () => {
    return await fetch(`${makeServerURL('/users/me')}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
}

export const updateMyProfile = async (data) => {
    return await fetch(`${makeServerURL('/users/me')}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
}

export const withdraw = async () => {
    return await fetch(`${makeServerURL('/users/withdraw')}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
}