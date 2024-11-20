import {deleteCommentRequest, getCommentsRequest, createCommentRequest, updateCommentRequest} from "../api/comment.js";
import {appendChildElement, focusOnElement, openModal} from "../utils/function.js";
import CommentItem from "../components/post/commentItem.js";
import {status, strings} from "../utils/constants.js";

document.addEventListener('DOMContentLoaded', () => {
    let isUpdate = false;
    let commentId;
    let postId;

    const data = {
        'content': ''
    }

    const commentInput = document.querySelector('#comment');
    const commentButton = document.querySelector('#comment-button');

    const createComment = async () => {
        const response = await createCommentRequest(postId, data);

        if (!response.ok) {
            if (response.status === status.BAD_REQUEST) {
                console.error('Bad Request : Create Comment');
            } else if (response.status === status.UNAUTHORIZED) {
                console.error('Unauthorized : Create Comment');
            } else if (response.status === status.NOT_FOUND) {
                console.error('Not Found : Create Comment');
            } else if (response.status === status.INTERNAL_SERVER_ERROR) {
                console.error('Internal Server Error : Create Comment');
            }
            return;
        }

        return await response.json();
    }

    const updateComment = async () => {
        const response = await updateCommentRequest(postId,commentId, data);

        if (!response.ok) {
            if (response.status === status.BAD_REQUEST) {
                console.error('Bad Request : Update Comment');
            } else if (response.status === status.UNAUTHORIZED) {
                console.error('Unauthorized : Update Comment');
            } else if (response.status === status.FORBIDDEN) {
                console.error('Forbidden : Update Comment');
            } else if (response.status === status.NOT_FOUND) {
                console.error('Not Found : Update Comment');
            } else if (response.status === status.INTERNAL_SERVER_ERROR) {
                console.error('Internal Server Error : Update Comment');
            }
            return;
        }

        return await response.json();
    }

    const submitCommentData = async () => {
        if (isUpdate) {
            const updateResult = await updateComment();
        } else {
            const createResult = await createComment();
        }
        commentInput.value = '';
        const comments = await getComments();
        await setComments(comments.data);
        isUpdate = false;
        commentButton.textContent = '댓글 등록';
    }

    const inputEventHandler = (e) => {
        data['content'] = e.target.value;
        observer(data['content']);
    }

    const observer = (value) => {
        commentButton.disabled = !value;
        commentButton.style.backgroundColor = commentButton.disabled ? '#ACA0EB' : '#7F6AEE';
    }

    const setEventListener = () => {
        commentInput.addEventListener('input', inputEventHandler);
        commentButton.addEventListener('click', submitCommentData);
    }

    const getComments = async () => {
        const response = await getCommentsRequest(postId);

        if (!response.ok) {
            throw new Error('failed to get comments');
        }

        return await response.json();
    }

    const setUpCommentData = (comment) => {
        isUpdate = true;

        const commentInput = document.querySelector('#comment');
        commentInput.value = comment.content;
        data['content'] = comment.content;

        const commentButton = document.querySelector('#comment-button');
        commentButton.textContent = '댓글 수정';

        commentId = comment.comment_id;

        observer(data['content']);
        focusOnElement(commentInput);
    }

    const deleteComment = async (commentId) => {
        const response = await deleteCommentRequest();

        if (!response.ok) {
            throw new Error('failed to delete comment');
        }

        return await response.json();
    }

    const setComments = async (comments) => {
        const container = document.querySelector('.comment-list-container');
        container.innerHTML = '';

        comments.forEach((comment) => {
            appendChildElement(CommentItem(
                comment,
                localStorage.getItem('user_id') === String(comment.user_id),
                {
                    delete: openModal.bind(
                        null,
                        strings.MODAL_COMMENT_DELETE_TITLE,
                        strings.MODAL_DELETE_CONTENT,
                        deleteComment.bind(
                            null,
                            comment.comment_id
                        )
                    ),
                    update: setUpCommentData.bind(
                        null,
                        comment
                    )
                }
            ), container);
        })
    }

    const checkPost = () => {
        const pathname = window.location.pathname;
        postId = Number(pathname.split('/')[2]);
    }

    const init = async () => {
        setEventListener();
        checkPost();
        const comments = await getComments();
        await setComments(comments.data);
    }

    init();
})