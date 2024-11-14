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