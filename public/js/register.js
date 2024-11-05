import {validator, constants} from "./util.js";

document.addEventListener("DOMContentLoaded", () => {
    const data = {
        'email': '',
        'password': '',
        'check-password': '',
        'nickname': '',
        'profileImg': ''
    };

    const registerButton = document.querySelector("#register");
    registerButton.addEventListener("click", (e) => {
        // 로그인 요청 및 응답에 대한 처리
        location.href = 'login';
    })

    // Helper Text 업데이트
    const updateHelper = (helperElement, message = '') => {
        helperElement.textContent = message;
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
            updateHelper(helper, constants.PROFILE_IMG_BLANK);
        } else {
            updateHelper(helper, constants.BLANK);
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

    const inputEventHandler = (e, id) => {
        const helper = document.querySelector(`#${id}-helper`);
        const value = e.target.value;

        if (id === 'email') {
            const isValid = validator.email(value);
            if (!value) {
                updateHelper(helper, constants.EMAIL_BLANK);
            } else if (!isValid) {
                updateHelper(helper, constants.EMAIL_INVALID);
            } else {
                // TODO : 중복 이메일 체크
                updateHelper(helper, constants.BLANK);
            }
        } else if (id === 'password') {
            const isValid = validator.password(value);
            const isCheckValid = validator.checkPassword(value, data['check-password']);
            if (!value) {
                updateHelper(helper, constants.PASSWORD_BLANK);
            } else if (!isValid) {
                updateHelper(helper, constants.PASSWORD_INVALID);
            } else if (!isCheckValid) {
                updateHelper(helper, constants.PASSWORD_NOT_MATCH);
            } else {
                updateHelper(helper, constants.BLANK);
            }
        } else if (id === 'check-password') {
            const isValid = validator.checkPassword( data['password'], value);
            const passwordHelper = document.querySelector(`#password-helper`);
            if (!value) {
                updateHelper(helper, constants.CHECK_PASSWORD_BLANK);
            } else if (!isValid) {
                updateHelper(helper, constants.PASSWORD_NOT_MATCH);
            } else {
                updateHelper(passwordHelper, constants.BLANK);
                updateHelper(helper, constants.BLANK);
            }

        } else if (id === 'nickname') {
            if (!value) {
                updateHelper(helper, constants.NICKNAME_BLANK);
            } else if (value.includes(' ')) {
                updateHelper(helper, constants.NICKNAME_INCLUDE_SPACE);
            } else if (value.length > constants.NICKNAME_INCLUDE_SPACE) {
                updateHelper(helper, constants.NICKNAME_EXCEED_MAX_LEN);
            } else {
                // TODO : 닉네임 중복 체크
                updateHelper(helper, constants.BLANK);
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
        addEventListenerInput();
    }

    init();
})


