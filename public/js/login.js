import {strings, status, validator} from "../utils/constants.js";
import { insertBeforeElement } from "../utils/function.js";
import Header from "../components/header/header.js";
import {loginRequest} from "../api/auth.js";
import {getMyProfile} from "../api/user.js";

document.addEventListener("DOMContentLoaded", () => {
    const formData = {
        'email': '',
        'password': ''
    };

    const loginButton = document.querySelector("#login");
    const helper = document.querySelector("#helper");

    // Helper Text 업데이트
    const updateHelper = (helperElement, message = '') => {
        helperElement.textContent = message;
    }

    const login = async () => {
        try {
            formData['password'] = window.btoa(formData['password']);

            const loginResponse = await loginRequest(formData);
            if (!loginResponse.ok) {
                if (loginResponse.status === status.UNAUTHORIZED) {
                    console.error('Unauthorized : Login')
                } else if (loginResponse.status === status.INTERNAL_SERVER_ERROR) {
                    console.error('Internal Server Error : Login');
                }
                updateHelper(helper, strings.FAILED_LOGIN);
                return;
            }

            const userResponse = await getMyProfile();
            if (!userResponse.ok) {
                if (userResponse.status === status.UNAUTHORIZED) {
                    console.error('Unauthorized : getMyProfile');
                } else if (userResponse.status === status.INTERNAL_SERVER_ERROR) {
                    console.error('Internal Server Error : getMyProfile');
                }
            }

            const user = await userResponse.json()
            localStorage.setItem("user", JSON.stringify(user.data));

            location.href = '/posts';
        } catch (e) {
            console.error(e);
        }
    }

    // Login Data 업데이트
    const updateData = (e, key) => {
        formData[key] = e.target.value;
        validateData();
    }

    // Login Data 유효성 검사
    const validateData = () => {
        const {email, password} = formData;

        const isValidEmail = validator.email(email);
        const isValidPassword = validator.password(password);

        loginButton.disabled = !(email && isValidEmail && password && isValidPassword);
        loginButton.style.backgroundColor = loginButton.disabled ? '#ACA0EB' : '#7F6AEE';
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
    }

    const init = () => {
        insertBeforeElement(Header(
            strings.HEADER_TITLE,
            false,
            null
        ), document.body);
        setEventListener();
        localStorage.clear();
    }

    init();
})


