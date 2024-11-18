import {makeServerURL} from "../utils/function.js";

export const createPostRequest = async (data) => {
    return await fetch(`${makeServerURL('/posts')}`, {
        method: 'POST',
        body: data,
        credentials: 'include',
    })
}

export const getPostsRequest = async (offset=0, limit=5) => {
    return await fetch(`${makeServerURL('/posts', {offset: offset, limit: limit})}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
}

export const getPostRequest = async (postId) => {
    return await fetch(`${makeServerURL(`/posts/${postId}`)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
}

export const updatePostRequest = async (postId, data) => {
    return await fetch(`${makeServerURL(`/posts/${postId}`)}`, {
        method: 'PATCH',
        body: data,
        credentials: 'include'
    })
}

export const deletePostRequest = async (postId) => {
    return await fetch('/mock/post/deletePost.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

