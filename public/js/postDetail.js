import {closeModal, convertToKUnit, insertBeforeElement, openModal} from "../utils/function.js";
import Header from "../components/header/header.js";
import {strings} from "../utils/constants.js";
import {deletePostRequest, getPostRequest} from "../api/post.js";

document.addEventListener('DOMContentLoaded', () => {
    let postId;
    const getPost = async () => {
        const response = await getPostRequest(postId);
        const result = await response.json();

        if (!response.ok) {
            console.error(`${result.error} : ${result.message}`);
            return;
        }

        return result.data;
    }

    const deletePost = async (postId) => {
        const response = await deletePostRequest(postId);

        if (!response.ok) {
            const result = await response.json();
            console.error(`${result.error} : ${result.message}`);
            return;
        }

        closeModal();
        window.location.href = '/posts';
    }

    const setPost = async (post, isAuth) => {
        console.log(post);
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
                        () => { deletePost(post.post_id) }
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
                item.firstElementChild.textContent = convertToKUnit(post.thumb_count);
            } else if (key === '조회수') {
                item.firstElementChild.textContent = convertToKUnit(post.view_count);
            } else if (key === '댓글') {
                item.firstElementChild.textContent = convertToKUnit(post.comment_count);
            }
        })
    }

    const init = async () => {
        insertBeforeElement(Header(
            strings.HEADER_TITLE,
            true,
            localStorage.getItem('profile_image')
        ), document.body);
        postId = Number(window.location.pathname.split('/')[2]);
        const post = await getPost();
        await setPost(post, localStorage.getItem('user_id') === String(post.user_id));
    }

    init();
})