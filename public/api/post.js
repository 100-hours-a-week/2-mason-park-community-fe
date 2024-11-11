export const getPostsRequest = async (offset=0, limit=5) => {
    return await fetch('/mock/post/posts.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const getPostRequest = async (postId) => {
    return await fetch('/mock/post/post.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
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

