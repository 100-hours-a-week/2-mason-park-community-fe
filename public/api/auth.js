export const loginRequest = async (data) => {
    return await fetch('/mock/auth/login.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const registerRequest = async (data) => {
    return await fetch('/mock/auth/register.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const existEmail = async (email) => {
    return await fetch('/mock/auth/existEmail.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const existNickname = async (nickname) => {
    return await fetch('/mock/auth/existNickname.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}