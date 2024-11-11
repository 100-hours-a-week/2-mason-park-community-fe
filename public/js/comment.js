import {deleteCommentRequest, getCommentsRequest, postCommentRequest, updateCommentRequest} from "../api/comment.js";
import {appendChildElement, focusOnElement, openModal} from "../utils/function.js";
import CommentItem from "../components/post/commentItem.js";
import {strings} from "../utils/constants.js";

document.addEventListener('DOMContentLoaded', () => {
    let isUpdate = false;
    let commentId;

    const data = {
        'content': ''
    }

    const commentInput = document.querySelector('#comment');
    const commentButton = document.querySelector('#comment-button');

    const postComment = async () => {
        const response = await postCommentRequest();

        if (!response.ok) {
            throw new Error('failed to update comment');
        }

        return await response.json();
    }

    const updateComment = async (commentId) => {
        const response = await updateCommentRequest();

        if (!response.ok) {
            throw new Error('failed to update comment');
        }

        return await response.json();
    }

    const submitCommentData = async () => {
        if (isUpdate) {
            await updateComment(commentId);
        } else {
            await postComment();
        }
        isUpdate = false;
    }

    const inputEventHandler = (e) => {
        data['content'] = e.target.value;
        observer(data['content']);
    }

    const observer = (value) => {
        console.log(!value);
        commentButton.disabled = !value;
        commentButton.style.backgroundColor = commentButton.disabled ? '#ACA0EB' : '#7F6AEE';
    }

    const setEventListener = () => {
        commentInput.addEventListener('input', inputEventHandler);
        commentButton.addEventListener('click', submitCommentData);
    }

    const getComments = async () => {
        const response = await getCommentsRequest();

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
        const container = document.querySelector('#comment-container');

        comments.forEach((comment) => {
            appendChildElement(CommentItem(
                comment,
                true,
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

    const init = async () => {
        setEventListener();
        const comments = await getComments();
        await setComments(comments.data);
    }

    init();
})