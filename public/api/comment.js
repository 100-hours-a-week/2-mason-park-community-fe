export const getCommentsRequest = async (postId, offset, limit) => {
    return await fetch('/mock/post/comments.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const postCommentRequest = async (postId, commentId, content) => {
    return await fetch('/mock/post/createComment.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const updateCommentRequest = async (postId, commentId, content) => {
    return await fetch('/mock/post/updateComment.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const deleteCommentRequest = async (postId, commentId) => {
    return await fetch('/mock/post/deleteComment.json', {
        mehtod: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}