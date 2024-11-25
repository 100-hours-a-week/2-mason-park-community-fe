import {validator, status, strings} from "../utils/constants.js";
import {insertBeforeElement, updateHelper} from "../utils/function.js";
import Header from "../components/header/header.js";
import {existEmail, existNickname, registerRequest} from "../api/auth.js";
import {uploadProfileImage} from "../api/user.js";

document.addEventListener("DOMContentLoaded", () => {
    let isDisabled = true;
    const formData = {
        'email': '',
        'password': '',
        'check-password': '',
        'nickname': '',
        'profile_image': ''
    };

    const registerButton = document.querySelector("#register");

    const register = async () => {
        try {
            if(isDisabled)  {
                return;
            }

            // base64 인코딩
            formData['password'] = window.btoa(formData['password']);

            const response = await registerRequest(formData);
            const result = await response.json();

            if (!response.ok) {
                console.error(`${result.error} : ${result.message}`);
                return;
            }

            location.href = 'login';
        } catch (e) {
            console.error(e);
        }

    }

    // Register Data 유효성 검사
    const validateData = () => {
        const {
            email,
            password,
            checkPassword,
            nickname,
        } = formData;

        isDisabled = !(
            email &&
            validator.email(email) &&
            password &&
            validator.password(password) &&
            nickname &&
            validator.nickname(nickname) &&
            (formData['password'] === formData['check-password'])
        );
        registerButton.style.backgroundColor = isDisabled ? '#ACA0EB' : '#7F6AEE';
        registerButton.style.cursor = isDisabled ? 'default' : 'pointer';
    }

    const updateData = (e, key) => {
        formData[key] = e.target.value;
        validateData();
    }

    const changeEventHandler = async (e, id) => {
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

            const image = new FormData();
            image.append('profile_image', file);

            const response = await uploadProfileImage(image);
            const result = await response.json();

            if (!response.ok) {
                console.error(`${result.error} : ${result.message}`);
                return;
            }

            const data = result.data;
            formData['profile_image'] = data.profile_image;
        }
    }

    const inputEventHandler = async (e, id) => {
        const helper = document.querySelector(`#${id}-helper`);
        const value = e.target.value;

        // 이메일 유효성 검사
        if (id === 'email') {
            const isValid = validator.email(value);
            if (!value) {
                updateHelper(helper, strings.EMAIL_BLANK);
            } else if (!isValid) {
                updateHelper(helper, strings.EMAIL_INVALID);
            } else {
                const response = await existEmail(value);

                if (response.status === status.CONFLICT) {
                    updateHelper(helper, strings.EMAIL_EXIST);
                } else if (response.status === status.OK) {
                    updateHelper(helper, strings.BLANK);
                }
            }
        }
        // 비밀번호 유효성 검사
        else if (id === 'password') {
            const isValid = validator.password(value);
            const isCheckValid = validator.checkPassword(value, formData['check-password']);
            if (!value) {
                updateHelper(helper, strings.PASSWORD_BLANK);
            } else if (!isValid) {
                updateHelper(helper, strings.PASSWORD_INVALID);
            } else if (!isCheckValid) {
                updateHelper(helper, strings.PASSWORD_NOT_MATCH);
            } else {
                updateHelper(helper, strings.BLANK);
            }
        }
        // 비밀번호 확인 유효성 검사
        else if (id === 'check-password') {
            const isValid = validator.checkPassword( formData['password'], value);
            const passwordHelper = document.querySelector(`#password-helper`);
            if (!value) {
                updateHelper(helper, strings.CHECK_PASSWORD_BLANK);
            } else if (!isValid) {
                updateHelper(helper, strings.PASSWORD_NOT_MATCH);
            } else {
                updateHelper(passwordHelper, strings.BLANK);
                updateHelper(helper, strings.BLANK);
            }

        }
        // 닉네임 유효성 검사
        else if (id === 'nickname') {
            if (!value) {
                updateHelper(helper, strings.NICKNAME_BLANK);
            } else if (value.includes(' ')) {
                updateHelper(helper, strings.NICKNAME_INCLUDE_SPACE);
            } else if (value.length > strings.NICKNAME_INCLUDE_SPACE) {
                updateHelper(helper, strings.NICKNAME_EXCEED_MAX_LEN);
            } else {
                const response = await existNickname(value);
                if (response.status === status.CONFLICT) {
                    updateHelper(helper, strings.NICKNAME_EXIST);
                } else if (response.status === status.OK) {
                    updateHelper(helper, strings.BLANK);
                }
            }
        }
        updateData(e, id);
    }

    const setEventListener = () => {
        // 폼 입력 이벤트리스너 
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
        document.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
               await register();
            }
        })
    }


    const init = () => {
        // 헤더 추가
        insertBeforeElement(Header(
            strings.HEADER_TITLE,
            true
        ), document.body);
        setEventListener();
    }

    init();
})


