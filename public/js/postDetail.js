import {convertToKUnit, insertBeforeElement, openModal} from "../utils/function.js";
import Header from "../components/header/header.js";
import {status, strings} from "../utils/constants.js";
import {deletePostRequest, getPostRequest} from "../api/post.js";

document.addEventListener('DOMContentLoaded', () => {

    const getPost = async (postId) => {
        const getResponse = await getPostRequest(postId);

        if (!getResponse.ok) {
            if (getResponse.status === status.BAD_REQUEST) {
                console.error('Bad Request : Get Post');
            } else if (getResponse.status === status.UNAUTHORIZED) {
                console.error('Unauthorized : Get Post')
            } else if (getResponse.status === status.NOT_FOUND) {
                console.error('Not Found : Get Post')
            } else if (getResponse.status === status.INTERNAL_SERVER_ERROR) {
                console.error('Internal Server Error : Get Post');
            }

            return;
        }

        return await getResponse.json();
    }

    const deletePost = async (postId) => {
        const deleteResponse = await deletePostRequest(postId);

        if (!deleteResponse.ok) {
            if (deleteResponse.status === status.BAD_REQUEST) {
                console.error('Bad Request : Delete Post');
            } else if (deleteResponse.status === status.UNAUTHORIZED) {
                console.error('Unauthorized : Delete Post');
            } else if (deleteResponse.status === status.NOT_FOUND) {
                console.error('Not Found : Delete Post');
            } else if (deleteResponse.status === status.INTERNAL_SERVER_ERROR) {
                console.error('Internal Server Error : Delete Post');
            }
            return;
        }

        location.href = '/posts';
    }

    const setPost = async (post, isAuth) => {
        const postTitle = document.querySelector('.h2-title');
        postTitle.textContent = post.title;

        const writer = post.user;

        const profileImg = document.querySelector('#post-writer-profile-img');
        profileImg.src = writer.profile_image;

        const profileNickname = document.querySelector('.profile-nickname');
        profileNickname.textContent = writer.nickname;

        const postCreatedAt = document.querySelector('#post-created-at')
        postCreatedAt.textContent = post.created_at;

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("btn-container");

        let button;
        ["수정", "삭제"].forEach(text => {
            button = document.createElement("div");
            button.classList.add("c-btn");
            button.textContent = text;
            button.addEventListener("click", (e) => {
                if (text === "수정") {
                    location.href = `/posts/${post.post_id}/modify`;
                } else if (text === "삭제") {
                    openModal(
                        strings.MODAL_POST_DELETE_TITLE,
                        strings.MODAL_DELETE_CONTENT,
                        deletePost.bind(
                            null,
                            post.post_id
                        ),
                    )
                }
            });

            buttonContainer.appendChild(button);
        })
        const postHeader = document.querySelector('.post-header');
        if (isAuth) {
            postHeader.appendChild(buttonContainer);
        }

        if (post.post_image) {
            const postImg = document.querySelector('.post-image');
            postImg.classList.remove('none');
            postImg.src = post.post_image;
        }

        const postContent = document.querySelector('.post-content');
        postContent.textContent = post.content;

        document.querySelectorAll(".post-meta").forEach(item => {
            const key = item.lastElementChild.textContent;
            if (key === '좋아요 수') {
                item.firstElementChild.textContent = convertToKUnit(post.thumbs);
            } else if (key === '조회수') {
                item.firstElementChild.textContent = convertToKUnit(post.views);
            } else if (key === '댓글') {
                item.firstElementChild.textContent = convertToKUnit(post.comments);
            }
        })
    }

    const init = async () => {
        insertBeforeElement(Header(
            strings.HEADER_TITLE,
            true,
            localStorage.getItem('profile_image')
        ), document.body);
        const pathname = window.location.pathname;
        const post = await getPost(Number(pathname.split('/')[2]));
        await setPost(post.data, localStorage.getItem('user_id') === String(post.data.user_id));
    }

    init();
})