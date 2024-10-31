import {constants, regex} from "../../util.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginData = {
        'email': '', 'password': ''
    };

    const helper = document.querySelector("#helper");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const loginButton = document.querySelector("#login");

    emailInput.addEventListener("input", (e) => {
        updateLoginData(e, 'email');
    });

    passwordInput.addEventListener("input", (e) => {
        updateLoginData(e, 'password');
    })

    loginButton.addEventListener("click", (e) => {
        // 로그인 요청 및 응답에 대한 처리
        location.href = '../../views/postList.html';
    })

    // 이메일 유효성 검사
    const validateEmail = (val) => {
        return regex.EMAIL.test(val);
    }
    // 비밀번호 유효성 검사
    const validatePassword = (val) => {
        return regex.PASSWORD.test(val);
    }

    // Helper Text 업데이트
    const updateHelper = (helperElement, message = '') => {
        helperElement.textContent = message;
    }

    // Login Data 업데이트
    const updateLoginData = (e, key) => {
        loginData[key] = e.target.value;
        validateLoginData();
    }

    // Login Data 유효성 검사
    const validateLoginData = () => {
        const email = loginData.email;
        const password = loginData.password;

        const isValidEmail = validateEmail(email);
        const isValidPassword = validatePassword(password);
        console.log(isValidEmail, isValidPassword);

        if (!email) {
            updateHelper(helper, '')
        } else if (!isValidEmail) {
            updateHelper(helper, constants.EMAIL_INVALID);
        } else if (!password) {
            updateHelper(helper, constants.PASSWORD_BLANK)
        } else if (!isValidPassword) {
            updateHelper(helper, constants.PASSWORD_INVALID);
        } else {
            updateHelper(helper, '')
        }

        loginButton.disabled = !(email && isValidEmail && password && isValidPassword);
        loginButton.style.backgroundColor = loginButton.disabled ? '#ACAOEB' : '#7F6AEE';
    }
})


