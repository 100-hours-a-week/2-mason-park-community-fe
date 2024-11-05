import {constants, validator} from "./util.js";

document.addEventListener("DOMContentLoaded", () => {
    const data = {
        'email': '',
        'password': ''
    };

    const loginButton = document.querySelector("#login");

    loginButton.addEventListener("click", (e) => {
        // 로그인 요청 및 응답에 대한 처리
        location.href = 'posts';
    })

    // Helper Text 업데이트
    const updateHelper = (helperElement, message = '') => {
        helperElement.textContent = message;
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
        loginButton.style.backgroundColor = loginButton.disabled ? '#ACAOEB' : '#7F6AEE';
    }

    const inputEventHandler = (e, id) => {
        const helper = document.querySelector("#helper");
        const value = e.target.value;
        if (id === 'email') {
            const isValid = validator.email(value);
            if (!value) {
                updateHelper(helper, constants.BLANK);
            } else if (!isValid) {
                updateHelper(helper, constants.EMAIL_INVALID);
            } else {
                updateHelper(helper, constants.PASSWORD_BLANK);
            }
        } else if (id === 'password') {
            const isValid = validator.password(value);
            if (!value) {
                updateHelper(helper, constants.PASSWORD_BLANK);
            } else if (!isValid) {
                updateHelper(helper, constants.PASSWORD_INVALID);
            } else {
                updateHelper(helper, constants.BLANK);
            }
        }
        updateData(e, id);
    }

    const addEventListenerInput = () => {
        const inputs = document.querySelectorAll('input');

        inputs.forEach(input => {
            const id = input.id;

            input.addEventListener('input', (e) => {
                inputEventHandler(e, id);
            })
        })
    }

    const init = () => {
        addEventListenerInput();
    }

    init();
})


