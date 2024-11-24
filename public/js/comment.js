import {deleteCommentRequest, getCommentsRequest, createCommentRequest, updateCommentRequest} from "../api/comment.js";
import {appendChildElement, closeModal, convertToKUnit, focusOnElement, openModal} from "../utils/function.js";
import CommentItem from "../components/post/commentItem.js";
import {strings} from "../utils/constants.js";

document.addEventListener('DOMContentLoaded', () => {
    let isDisabled = true;
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
        const result = await response.json();

        if (!response.ok) {
            console.error(`${result.error} : ${result.message}`);
            return;
        }

        return result.data;
    }

    const updateComment = async () => {
        const response = await updateCommentRequest(postId,commentId, data);
        const result = await response.json();

        if (!response.ok) {
            console.error(`${result.error} : ${result.message}`);
            return;
        }

        return result.data;
    }

    const submitCommentData = async () => {
        if (isUpdate) {
            await updateComment();
        } else {
            await createComment();
        }
        commentInput.value = '';

        const comments = await getComments();
        await setComments(comments);
        isUpdate = false;
        commentButton.textContent = '댓글 등록';
    }

    const inputEventHandler = (e) => {
        data['content'] = e.target.value;
        observer(data['content']);
    }

    const observer = (value) => {
        isDisabled = !value;
        commentButton.style.backgroundColor = isDisabled ? '#ACA0EB' : '#7F6AEE';
        commentButton.style.cursor = isDisabled ? 'default' : 'pointer';
    }

    const setEventListener = () => {
        commentInput.addEventListener('input', inputEventHandler);
        commentButton.addEventListener('click', submitCommentData);
    }

    const getComments = async () => {
        const response = await getCommentsRequest(postId);
        const result = await response.json();

        if (!response.ok) {
            console.error(`${result.error} : ${result.message}`);
            return;
        }

        document.querySelectorAll(".post-meta").forEach(item => {
            const key = item.lastElementChild.textContent;
            if (key === '댓글') {
                item.firstElementChild.textContent = convertToKUnit(result.data.length);
            }
        })

        return result.data;
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
        const response = await deleteCommentRequest(postId, commentId);
        if (!response.ok) {
            const result = await response.json();
            console.error(`${result.error} : ${result.message}`);
            return;
        }

        closeModal();

        const comments = await getComments();
        await setComments(comments);
    }

    const setComments = async (comments) => {
        const container = document.querySelector('.comment-list-container');
        container.innerHTML = '';

        comments.forEach((comment) => {
            appendChildElement(CommentItem(
                comment,
                localStorage.getItem('user_id') === String(comment.user_id),
                {
                    delete: () => openModal(
                        strings.MODAL_COMMENT_DELETE_TITLE,
                        strings.MODAL_DELETE_CONTENT,
                        () => deleteComment(comment.comment_id)
                    ),
                    update: () => setUpCommentData(comment)
                }
            ), container);
        })
    }

    const init = async () => {
        setEventListener();
        postId = Number(window.location.pathname.split('/')[2]);
        const comments = await getComments();
        await setComments(comments);
    }

    init();
})