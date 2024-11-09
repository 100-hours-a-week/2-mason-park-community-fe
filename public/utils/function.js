import { status } from './constants.js';

export const insertBeforeElement = (child, parent) => {
    parent.insertBefore(child, parent.firstChild);
}

export const appendChildElement = (child, parent) => {
    parent.appendChild(child);
}

export const get = async (host, path, header = {}) => {
    const url = `http://${host}/${path}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...headers,
        }
    }

    const res = await fetch(url, options);
    const data = await res.json();

    if (res.status === status.OK) {
        return data;
    }
}

export const post = async (host, path, body, header = {}) => {
    const url = `http://${host}/${path}`;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        body: JSON.stringify(body),
    }

    const res = await fetch(url, options);
    const data = await res.json();

    if (res.status === status.CREATED) {
        return data;
    }
}