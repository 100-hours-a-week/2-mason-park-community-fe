import {strings} from "../utils/constants.js";
import {insertBeforeElement} from "../utils/function.js";
import Header from "../components/header/header.js";
import {createPostRequest, getPostRequest, updatePostRequest} from "../api/post.js";
import {status} from "../utils/constants.js";

document.addEventListener("DOMContentLoaded", () => {
    let postId;
    let isUpdate = false;
    const data = {
        'title': '',
        'content': '',
    }
    const formData = new FormData();

    const helper = document.querySelector(".span-helper");
    const writeButton = document.querySelector('#write');

    writeButton.addEventListener("click", async (e) => {

        formData.append('data', new Blob([JSON.stringify(data)], {
            // JSON 타입 지정
            type: 'application/json',
        }));

        if (isUpdate) {
            const updateResponse = await updatePostRequest(postId, formData);
            if (!updateResponse.ok) {
                if (updateResponse.status === status.BAD_REQUEST) {
                    console.error('Bad Request : Update Post');
                } else if (updateResponse.status === status.UNAUTHORIZED) {
                    console.error('Unauthorized : Update Post');
                } else if (updateResponse.status === status.FORBIDDEN) {
                    console.error('Forbidden : Update Post');
                } else if (updateResponse.status === status.NOT_FOUND) {
                    console.error('Not Found : Update Post');
                } else if (updateResponse.status === status.INTERNAL_SERVER_ERROR) {
                    console.error('Internal Server Error : Update Post');
                }
                return;
            }

            const updateResult = await updateResponse.json();
            location.href = `/posts/${updateResult.data.post_id}`;

        } else {
            const createResponse = await createPostRequest(formData);
            if (!createResponse.ok) {
                if (createResponse.status === status.BAD_REQUEST) {
                    console.error('Bad Request : Create Post');
                } else if (createResponse.status === status.UNAUTHORIZED) {
                    console.error('Unauthorized : Create Post');
                } else if (createResponse.status === status.INTERNAL_SERVER_ERROR) {
                    console.error('Internal Server Error : Create Post');
                }
                return;
            }

            const createResult = await createResponse.json();
            location.href = `/posts/${createResult.data.post_id}`;
        }
    })

    const updateHelper = (helperElement, message = '') => {
        helperElement.textContent = message;
    }

    const validateData = () => {
        const {
            title,
            content
        } = data;

        if (!data['title'] || !data['content']) {
            updateHelper(helper, strings.TITLE_CONTENT_BLANK);
        } else {
            updateHelper(helper, strings.BLANK);
        }

        writeButton.disabled = !(
            title &&
            content
        )
        writeButton.style.backgroundColor = writeButton.disabled ? '#ACA0EB' : '#7F6AEE';
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
                    updateData(e, id);
                })
            }
        })
    }

    const checkUpdate = async () => {
        const pathname = window.location.pathname;

        if (!pathname.includes(strings.MODIFY_URL)) {
            return;
        }

        isUpdate = true;
        const title = document.querySelector('.h2-title');
        title.textContent = strings.MODIFY_TITLE;

        postId = Number(pathname.split('/')[2]);
        const response = await getPostRequest(postId);

        const post = await response.json();

        const titleInput = document.querySelector('#title');
        titleInput.value = post.data.title;
        data['title'] = post.data.title;

        const contentInput = document.querySelector('#content');
        contentInput.value = post.data.content;
        data['content'] = post.data.title;

        validateData();
    }

    const init = async () => {
        insertBeforeElement(Header(
            strings.HEADER_TITLE,
            true,
            localStorage.getItem('profile_image')
        ), document.body)

        addEventListenerInput();

        // 등록 / 수정 체크
        await checkUpdate();
    }
    init();
})