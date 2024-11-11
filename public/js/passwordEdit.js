  import {strings, status, validator} from "../utils/constants.js";
import { insertBeforeElement } from "../utils/function.js";
import Header from "../components/header/header.js";
import {loginRequest} from "../api/auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const data = {
        'password': '',
        'check-password': '',
    };

    const updateButton  = document.querySelector("#update");

    // Helper Text 업데이트
    const updateHelper = (helperElement, message = '') => {
        helperElement.textContent = message;
    }

    const passwordUpdate = async () => {
        const response = await loginRequest(data);

        if (response.status !== status.OK) {
            updateHelper(helper, strings.FAILED_LOGIN);
            return;
        }

        location.href = '/login';
    }

    // Login Data 업데이트
    const updateData = (e, key) => {
        data[key] = e.target.value;
        validateData();
    }

    // Login Data 유효성 검사
    const validateData = () => {

        const isValidPassword = validator.password(data['password']);
        updateButton.disabled = !(data['password'] && isValidPassword && (data['password'] === data['check-password']));
        updateButton.style.backgroundColor = updateButton.disabled ? '#ACA0EB' : '#7F6AEE';
    }

    const inputEventHandler = (e, id) => {
        const helper = document.querySelector(`#${id}-helper`);
        const value = e.target.value;

        if (id === 'password') {
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

        updateButton.addEventListener("click", passwordUpdate);
    }

    const init = () => {
        insertBeforeElement(Header(
            strings.HEADER_TITLE,
            false
        ), document.body);
        setEventListener();
    }

    init();
})


