import {strings, status, validator} from "../utils/constants.js";
import {insertBeforeElement, updateHelper} from "../utils/function.js";
import Header from "../components/header/header.js";
import {updatePassword} from "../api/user.js";

document.addEventListener("DOMContentLoaded", () => {
    let isDisabled = true;
    const formData = {
        'password': '',
        'check-password': '',
    };

    const updateButton  = document.querySelector("#update");

    const passwordUpdate = async () => {
        try {
            if (isDisabled) {
                return;
            }

            formData['password'] = window.btoa(formData['password']);

            const response = await updatePassword(formData);
            const result = await response.json();

            if (!response.ok) {
                console.error(`${result.error} : ${result.message}`);
                return;
            }

            const toast = document.querySelector("#toast");

            toast.classList.toggle('active');
            setTimeout(() => {
                toast.classList.toggle('active');
            }, 2000);
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

        const isValidPassword = validator.password(formData['password']);
        isDisabled = !(formData['password'] && isValidPassword && (formData['password'] === formData['check-password']));

        updateButton.style.backgroundColor = isDisabled ? '#ACA0EB' : '#7F6AEE';
        updateButton.style.cursor = isDisabled ? 'default' : 'pointer';
    }

    const inputEventHandler = (e, id) => {
        const helper = document.querySelector(`#${id}-helper`);
        const value = e.target.value;

        if (id === 'password') {
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
        } else if (id === 'check-password') {
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
            false,
            localStorage.getItem('profile_image')
        ), document.body);
        setEventListener();
    }

    init();
})


