import {limit, strings, validator} from "../utils/constants.js";
import {insertBeforeElement, updateHelper} from "../utils/function.js";
import Header from "../components/header/header.js";
import {createPostRequest, getPostRequest, updatePostRequest} from "../api/post.js";

document.addEventListener("DOMContentLoaded", () => {
    let postId;
    let isUpdate = false;
    let isDisabled = true;
    const data = {
        'title': '',
        'content': '',
    }
    const formData = new FormData();

    const helper = document.querySelector(".span-helper");
    const writeButton = document.querySelector('#write');

    const submitPost = async () => {
        try {
            if (isDisabled) {
                return;
            }

            formData.append('data', new Blob([JSON.stringify(data)], {
                // JSON 타입 지정
                type: 'application/json',
            }));

            if (isUpdate) {
                await updatePost();
            } else {
                await createPost();
            }
        } catch (e) {
            console.log(e);
        }
    }

    const createPost = async () => {
        const response = await createPostRequest(formData);
        const result = await response.json();

        if (!response.ok) {
            console.error(`${result.error} : ${result.message}`);
            return;
        }

        location.href = `/posts/${result.data.post_id}`;
    }

    const updatePost = async () => {
        const response = await updatePostRequest(postId, formData);
        const result = await response.json();

        if (!response.ok) {
            console.error(`${result.error} : ${result.message}`);
            return;
        }

        location.href = `/posts/${postId}`;
    }

    const validateData = () => {
        const {
            title,
            content
        } = data;

        isDisabled = !(
            title && validator.postTitle(title) &&
            content && validator.postContent(content)
        );

        writeButton.style.backgroundColor = isDisabled ? '#ACA0EB' : '#7F6AEE';
        writeButton.style.cursor = isDisabled ? 'default' : 'pointer';
    }

    const updateData = (e, key) => {
        data[key] = e.target.value;
        validateData();
    }

    const changeEventHandler = (e, id) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        formData.append('post_image', file);
    }

    const inputEventHandler = (e, id) => {
        const value = e.target.value;

        if (id === 'title') {
            const input = document.querySelector('#title');
            const isValid = validator.postTitle(value);
            if (!value) {
                updateHelper(helper, strings.TITLE_CONTENT_BLANK);
            } else if (!isValid) {
                input.value = value.substring(0, limit.TITLE_MAX_LEN + 1);
                data[id] = value.substring(0, limit.TITLE_MAX_LEN + 1);
            } else {
                updateHelper(helper, strings.BLANK);
            }
        } else if (id === 'content') {
            const input = document.querySelector('#content');
            const isValid = validator.postContent(value);
            if (!value) {
                updateHelper(helper, strings.TITLE_CONTENT_BLANK);
            } else if (!isValid) {
                input.value = value.substring(0, limit.CONTENT_MAX_LEN + 1);
                data[id] = value.substring(0, limit.CONTENT_MAX_LEN + 1);
            } else {
                updateHelper(helper, strings.BLANK);
            }
        }

        updateData(e, id);
    }

    const addEventListenerInput = () => {
        const inputs = document.querySelectorAll('.input');

        inputs.forEach(input => {
            const id = input.id;

            if (id === 'image') {
                input.addEventListener('change', (e) => {
                    changeEventHandler(e, id);
                })
            } else {
                input.addEventListener('input', (e) => {
                    inputEventHandler(e, id);
                })
            }
        })
    }

    const checkUpdate = async () => {
        const pathname = window.location.pathname;

        // URL Path로 수정 페이지인지 검사
        if (!pathname.includes(strings.MODIFY_URL)) {
            return;
        }

        isUpdate = true;

        postId = Number(pathname.split('/')[2]);
        const response = await getPostRequest(postId);
        const result = await response.json();

        if (!response.ok) {
            console.error(`${result.error} : ${result.message}`);
            return;
        }

        const title = document.querySelector('.h2-title');
        title.textContent = strings.MODIFY_TITLE;

        const titleInput = document.querySelector('#title');
        titleInput.value = result.data.title;
        data['title'] = result.data.title;

        const contentInput = document.querySelector('#content');
        contentInput.value = result.data.content;
        data['content'] = result.data.content;

        validateData();
    }

    const setEventListener = () => {
        addEventListenerInput();
        writeButton.addEventListener("click", submitPost);
        document.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                await submitPost();
            }
        })
    }

    const init = async () => {
        insertBeforeElement(Header(
            strings.HEADER_TITLE,
            true,
            localStorage.getItem('profile_image')
        ), document.body)
        setEventListener();
        // 등록 / 수정 체크
        await checkUpdate();
    }
    init();
})