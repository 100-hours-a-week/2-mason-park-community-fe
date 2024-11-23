import {strings, status, validator} from "../utils/constants.js";
import { insertBeforeElement } from "../utils/function.js";
import Header from "../components/header/header.js";
import {updatePassword} from "../api/user.js";

document.addEventListener("DOMContentLoaded", () => {
    const formData = {
        'password': '',
        'check-password': '',
    };

    const updateButton  = document.querySelector("#update");

    // Helper Text 업데이트
    const updateHelper = (helperElement, message = '') => {
        helperElement.textContent = message;
    }

    const passwordUpdate = async () => {
        try {
            formData['password'] = window.btoa(formData['password']);

            const updateResponse = await updatePassword(formData);

            if (!updateResponse.ok) {
                if (updateResponse.status === status.BAD_REQUEST) {
                    console.error('Bad Request : Password Update')
                } else if (updateResponse.status === status.UNAUTHORIZED) {
                    console.error('Unauthorized : Password Update')
                } else if (updateResponse.status === status.NOT_FOUND) {
                    console.error('Not Found : Password Update')
                } else if (updateResponse.status === status.INTERNAL_SERVER_ERROR) {
                    console.error('Internal Server Error : Password Update');
                }
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
        updateButton.disabled = !(formData['password'] && isValidPassword && (formData['password'] === formData['check-password']));
        updateButton.style.backgroundColor = updateButton.disabled ? '#ACA0EB' : '#7F6AEE';
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


