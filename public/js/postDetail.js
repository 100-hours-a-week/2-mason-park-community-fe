import {blockScroll, convertToKUnit, insertBeforeElement, openModal} from "../utils/function.js";
import Header from "../components/header/header.js";
import Modal from "../components/modal/modal.js"
import {strings} from "../utils/constants.js";
import {deletePostRequest, getPostRequest} from "../api/post.js";

document.addEventListener('DOMContentLoaded', () => {

    const getPost = async (postId) => {
        const response = await getPostRequest();

        if (!response.ok) {
            throw new Error('failed to get post');
        }

        return await response.json();
    }

    const deletePost = async (postId) => {
        const response = await deletePostRequest();

        if (!response.ok) {
            throw new Error('failed to delete post');
        }
        return await response.json();
    }

    const setPost = async (post, isAuth) => {
        const postTitle = document.querySelector('.h2-title');
        postTitle.textContent = post.title;

        const writer = post.writer;

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

        const postImg = document.querySelector('.post-image');
        postImg.src = post.post_image;

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
            true
        ), document.body);

        const post = await getPost();
        await setPost(post.data, true);
    }

    init();
})