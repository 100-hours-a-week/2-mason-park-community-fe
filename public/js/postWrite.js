import {strings} from "../utils/constants.js";
import {insertBeforeElement} from "../utils/function.js";
import Header from "../components/header/header.js";
import {getPostRequest} from "../api/post.js";

document.addEventListener("DOMContentLoaded", () => {
    let postId;
    let isUpdate = false;
    const data = {
        'title': '',
        'content': '',
        'image': ''
    }
    const helper = document.querySelector(".span-helper");
    const writeButton = document.querySelector('#write');
    writeButton.addEventListener("click", (e) => {

        if (!isUpdate) {
            // TODO : 수정 API 요청
        } else {
            // TODO : 등록 API 요청
        }

        location.href = `/posts/${postId}`;
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

        // TODO: 이미지 등록 POST 요청
    }

    const addEventListenerInput = () => {
        const inputs = document.querySelectorAll('.input');

        inputs.forEach(input => {
            const id = input.id;

            if (id === 'img') {
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

        if (pathname.includes(strings.MODIFY_URL)) {
            isUpdate = true;
            const title = document.querySelector('.h2-title');
            title.textContent = strings.MODIFY_TITLE;
        }

        postId = Number(pathname.split('/')[2]);
        const response = await getPostRequest(postId);

        const post = await response.json();

        const titleInput = document.querySelector('#title');
        titleInput.value = post.data.title;
        data['title'] = post.data.title;

        const contentInput = document.querySelector('#content');
        contentInput.value = post.data.content;
        data['content'] = post.data.title;

        const imageInput = document.querySelector('#image');
        // TODO : 등록한 이미지 있을 경우 처리

        validateData();
    }

    const init = async () => {
        insertBeforeElement(Header(
            strings.HEADER_TITLE,
            true
        ), document.body)

        addEventListenerInput();

        // 등록 / 수정 체크
        await checkUpdate();
    }
    init();
})