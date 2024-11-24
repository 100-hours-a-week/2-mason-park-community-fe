import {strings, validator} from "../utils/constants.js";
import {insertBeforeElement, updateHelper} from "../utils/function.js";
import Header from "../components/header/header.js";
import {loginRequest} from "../api/auth.js";
import {getMyProfile} from "../api/user.js";

document.addEventListener("DOMContentLoaded", () => {
    let isDisabled = true;
    const formData = {
        'email': '',
        'password': ''
    };

    const loginButton = document.querySelector("#login");
    const helper = document.querySelector("#helper");


    const login = async () => {
        try {
            if (isDisabled) {
                return;
            }

            formData['password'] = window.btoa(formData['password']);

            const response = await loginRequest(formData);
            const result = await response.json();
            if (!response.ok) {
                console.error(`${result.error} : ${result.message}`);
                updateHelper(helper, strings.FAILED_LOGIN);
                return;
            }
            await setUserData();
            location.href = '/posts';
        } catch (e) {
            console.error(e);
        }
    }

    const setUserData = async () => {
        const response = await getMyProfile();
        const result = await response.json();

        if (!response.ok) {
            console.error(`${result.error} : ${result.message}`);
            return;
        }

        localStorage.setItem("profile_image", result.data.profile_image);
        localStorage.setItem("user_id", result.data.user_id);
        localStorage.setItem("email", result.data.email);
        localStorage.setItem("nickname", result.data.nickname);
        localStorage.setItem("is_authenticated", result.data.is_authenticated);
    }

    // Login Data 업데이트
    const updateData = (e, key) => {
        formData[key] = e.target.value;
        validateData();
    }

    // Login Data 유효성 검사
    const validateData = () => {
        const {email, password} = formData;

        isDisabled = !(
            email && validator.email(email) &&
            password && validator.password(password)
        );

        loginButton.style.backgroundColor = isDisabled ? '#ACA0EB' : '#7F6AEE';
        loginButton.style.cursor = isDisabled ? 'default' : 'pointer';
    }

    const inputEventHandler = (e, id) => {
        const value = e.target.value;
        if (id === 'email') {
            const isValid = validator.email(value);
            if (!value) {
                updateHelper(helper, strings.BLANK);
            } else if (!isValid) {
                updateHelper(helper, strings.EMAIL_INVALID);
            } else {
                updateHelper(helper, strings.PASSWORD_BLANK);
            }
        } else if (id === 'password') {
            const isValid = validator.password(value);
            if (!value) {
                updateHelper(helper, strings.PASSWORD_BLANK);
            } else if (!isValid) {
                updateHelper(helper, strings.PASSWORD_INVALID);
            } else {
                updateHelper(helper, strings.BLANK);
            }
        }
        updateData(e, id);
    }

    const setEventListener = () => {
        const inputs = document.querySelectorAll('input');

        inputs.forEach(input => {
            const id = input.id;

            input.addEventListener('input', (e) => {
                inputEventHandler(e, id);
            })
        })

        loginButton.addEventListener("click", login);
        document.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                await login();
            }
        })
    }

    const init = () => {
        insertBeforeElement(Header(
            strings.HEADER_TITLE,
            false
        ), document.body);
        setEventListener();
        localStorage.clear();
    }

    init();
})


