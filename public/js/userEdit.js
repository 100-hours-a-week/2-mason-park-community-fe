import {strings, validator} from "../utils/constants.js";
import {insertBeforeElement, openModal} from "../utils/function.js";
import Header from "../components/header/header.js";

document.addEventListener('DOMContentLoaded', () => {
    const data = {
        'nickname': '',
        'profileImg': ''
    }

    const modifyButton = document.querySelector("#modify");
    const withdrawButton = document.querySelector("#withdraw");
    modifyButton.addEventListener("click", (e) => {
        // TODO : 수정 API 호출
    })

    const deleteUser = async () => {
        console.log("deleteUser");
    }

    withdrawButton.addEventListener("click", (e) => {
        openModal(
            strings.MODAL_USER_DELETE_TITLE,
            strings.MODAL_USER_DELETE_CONTETN,
            deleteUser
        );

    })

    // Helper Text 업데이트
    const updateHelper = (helperElement, message = '') => {
        helperElement.textContent = message;
    }

    // Register Data 유효성 검사
    const validateData = () => {
        const {
            nickname,
            profileImg,
        } = data;

        modifyButton.disabled = !(
            profileImg ||
            nickname &&
            validator.nickname(nickname)
        );
        modifyButton.style.backgroundColor = modifyButton.disabled ? '#ACA0EB' : '#7F6AEE';
    }

    const updateData = (e, key)  => {
        data[key] = e.target.value;
        validateData();
    }

    const changeEventHandler = (e, id) => {
        const file = e.target.files[0];

        if (!file) return;

        // 이미지 미리보기
        const fileReader = new FileReader();
        const img = document.querySelector(".image-cover");

        fileReader.onload = (e) => {
            img.setAttribute('src', e.target.result);
            img.setAttribute('width', '150');
            img.style.objectFit = 'contain';
        }
        fileReader.readAsDataURL(file);

        // TODO: 이미지 등록 POST 요청

    }

    const inputEventHandler = (e, id) => {
        const helper = document.querySelector(".span-helper");
        const value = e.target.value;

        if (id === 'nickname') {
            if (!value) {
                updateHelper(helper, strings.NICKNAME_BLANK);
            } else if (value.includes(' ')) {
                updateHelper(helper, strings.NICKNAME_INCLUDE_SPACE);
            } else if (value.length > strings.NICKNAME_INCLUDE_SPACE) {
                updateHelper(helper, strings.NICKNAME_EXCEED_MAX_LEN);
            } else {
                // TODO : 닉네임 중복 체크
                updateHelper(helper, strings.BLANK);
            }
        }
        updateData(e, id);
    }

    const addEventListenerInput = () => {
        const inputs = document.querySelectorAll(".input");

        inputs.forEach(input => {
            const id = input.id;

            if (id === 'profile-img') {
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

    const init = () => {
        insertBeforeElement(Header(
            strings.HEADER_TITLE,
            true
        ), document.body);
        addEventListenerInput();
    };
    init();
})