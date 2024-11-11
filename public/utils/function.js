import {status} from './constants.js';
import Modal from "../components/modal/modal.js";

export const insertBeforeElement = (child, parent) => {
    parent.insertBefore(child, parent.firstChild);
}

export const appendChildElement = (child, parent) => {
    parent.appendChild(child);
}

export const convertToKUnit = (val) => {
    if (Number(val) >= 100000) {
        return '100K';
    } else if (Number(val) >= 10000) {
        return '10K';
    } else if (Number(val) >= 1000) {
        return '1K';
    } else {
        return val;
    }
}

export const focusOnElement = (elem) => {
    elem.focus();
}

const getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.offsetWidth;
}

export const blockScroll = (className= 'stop-scrolling') => {
    const isBlocked = document.body.classList.contains(className);
    if(isBlocked) return;

    document.body.style.setProperty('--scrollbar-width', `${getScrollbarWidth()}px`);
    document.body.classList.add(className);
}

export const unblockScroll = (className= 'stop-scrolling') => {
    const isBlocked = document.body.classList.contains(className);
    if(!isBlocked) return;

    document.body.style.removeProperty('--scrollbar-width');
    document.body.classList.remove(className);
}

export const openModal = (title, content, handler) => {
    insertBeforeElement(Modal(
        title,
        content,
        handler
    ), document.querySelector("main"));
    blockScroll();
}

export const closeModal = () => {
    document.querySelector('.modal-container').remove();
    unblockScroll();
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