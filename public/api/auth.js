export const loginRequest = async (data) => {
    return await fetch('/mock/auth/login.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}