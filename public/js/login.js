import {strings, status, validator} from "../utils/constants.js";
import { insertBeforeElement } from "../utils/function.js";
import Header from "../components/header/header.js";
import {loginRequest} from "../api/auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const data = {
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
        const response = await loginRequest(data);

        if (response.status !== status.OK) {
            updateHelper(helper, strings.FAILED_LOGIN);
            return;
        }

        // TODO: 쿠키 설정
        location.href = '/posts';
    }

    // Login Data 업데이트
    const updateData = (e, key) => {
        data[key] = e.target.value;
        validateData();
    }

    // Login Data 유효성 검사
    const validateData = () => {
        const {email, password} = data;

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
            false
        ), document.body);
        setEventListener();
        localStorage.clear();
        document.cookie = '';
    }

    init();
})


