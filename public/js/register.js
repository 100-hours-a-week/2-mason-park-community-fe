import {validator, status, strings} from "../utils/constants.js";
import {setHeader} from "../utils/function.js";
import Header from "../components/header/header.js";
import {existEmail, existNickname, loginRequest} from "../api/auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const data = {
        'email': '',
        'password': '',
        'check-password': '',
        'nickname': '',
        'profileImg': ''
    };

    const registerButton = document.querySelector("#register");

    // Helper Text 업데이트
    const updateHelper = (helperElement, message = '') => {
        helperElement.textContent = message;
    }

    const register = async () => {
        // TODO : 회원가입 요청 및 응답에 대한 처리
        const response = await loginRequest(data);

        if (response.status !== status.OK) {
            return;
        }

        location.href = 'login';
    }

    // Register Data 유효성 검사
    const validateData = () => {
        const {
            email,
            password,
            checkPassword,
            nickname,
        } = data;

        registerButton.disabled = !(
            email &&
            validator.email(email) &&
            password &&
            validator.password(password) &&
            nickname &&
            validator.nickname(nickname)
        );
        registerButton.style.backgroundColor = registerButton.disabled ? '#ACAOEB' : '#7F6AEE';
    }

    const updateData = (e, key) => {
        data[key] = e.target.value;
        validateData();
    }

    const changeEventHandler = (e, id) => {
        const helper = document.querySelector(`#${id}-helper`);

        const file = e.target.files[0];

        if (!file) {
            updateHelper(helper, strings.PROFILE_IMG_BLANK);
        } else {
            updateHelper(helper, strings.BLANK);
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
    }

    const inputEventHandler = async (e, id) => {
        const helper = document.querySelector(`#${id}-helper`);
        const value = e.target.value;

        if (id === 'email') {
            const isValid = validator.email(value);
            if (!value) {
                updateHelper(helper, strings.EMAIL_BLANK);
            } else if (!isValid) {
                updateHelper(helper, strings.EMAIL_INVALID);
            } else {
                const response = await existEmail(value);
                if (response.status === status.CONFLICT) {
                    updateHelper(helper, strings.EMAIL_INVALID);
                } else if (response.status === status.OK) {
                    updateHelper(helper, strings.BLANK);
                }
            }
        } else if (id === 'password') {
            const isValid = validator.password(value);
            const isCheckValid = validator.checkPassword(value, data['check-password']);
            if (!value) {
                updateHelper(helper, strings.PASSWORD_BLANK);
            } else if (!isValid) {
                updateHelper(helper, strings.PASSWORD_INVALID);
            } else if (!isCheckValid) {
                updateHelper(helper, strings.PASSWORD_NOT_MATCH);
            } else {
                updateHelper(helper, strings.BLANK);
            }
        } else if (id === 'check-password') {
            const isValid = validator.checkPassword( data['password'], value);
            const passwordHelper = document.querySelector(`#password-helper`);
            if (!value) {
                updateHelper(helper, strings.CHECK_PASSWORD_BLANK);
            } else if (!isValid) {
                updateHelper(helper, strings.PASSWORD_NOT_MATCH);
            } else {
                updateHelper(passwordHelper, strings.BLANK);
                updateHelper(helper, strings.BLANK);
            }

        } else if (id === 'nickname') {
            if (!value) {
                updateHelper(helper, strings.NICKNAME_BLANK);
            } else if (value.includes(' ')) {
                updateHelper(helper, strings.NICKNAME_INCLUDE_SPACE);
            } else if (value.length > strings.NICKNAME_INCLUDE_SPACE) {
                updateHelper(helper, strings.NICKNAME_EXCEED_MAX_LEN);
            } else {
                const response = await existNickname(value);
                if (response.status === status.CONFLICT) {
                    updateHelper(helper, strings.EMAIL_INVALID);
                } else if (response.status === status.OK) {
                    updateHelper(helper, strings.BLANK);
                }
            }
        }
        updateData(e, id);
    }

    const setEventListener = () => {
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

        registerButton.addEventListener("click", register);
    }


    const init = () => {
        setHeader(Header(
            strings.HEADER_TITLE,
            true
        ));
        setEventListener();
    }

    init();
})


