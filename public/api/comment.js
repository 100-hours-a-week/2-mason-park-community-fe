import {makeServerURL} from "../utils/function.js";

export const getCommentsRequest = async (postId, offset, limit) => {
    return await fetch(`${makeServerURL(`/posts/${postId}/comments`)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
}

export const createCommentRequest = async (postId, data) => {
    return await fetch(`${makeServerURL(`/posts/${postId}/comments`)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
}

export const updateCommentRequest = async (postId, commentId, data) => {
    return await fetch(`${makeServerURL(`/posts/${postId}/comments/${commentId}`)}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
}

export const deleteCommentRequest = async (postId, commentId) => {
    return await fetch(`${makeServerURL(`/posts/${postId}/comments/${commentId}`)}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
}